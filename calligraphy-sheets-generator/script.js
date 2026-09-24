document.addEventListener('DOMContentLoaded', () => {
    // --- Set current year in footer ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('show');
    });

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    };

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- UI Elements ---
    const pdfContent = document.getElementById('pdf-content');
    const textInput = document.getElementById('practiceText');
    const fontSelect = document.getElementById('fontFamily');
    const sizeInput = document.getElementById('fontSize');
    const sizeVal = document.getElementById('fontSizeVal');
    const lineSpacingInput = document.getElementById('lineSpacing');
    const lineSpacingVal = document.getElementById('lineSpacingVal');
    const colorInput = document.getElementById('textColor');
    const opacityInput = document.getElementById('textOpacity');
    const opacityVal = document.getElementById('textOpacityVal');
    const guideCheckbox = document.getElementById('showGuidelines');
    const watermarkCheckbox = document.getElementById('showWatermark');
    const alignSelect = document.getElementById('textAlign');
    
    // Export Buttons
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const printBtn = document.getElementById('printBtn');
    
    // Constants
    const PAGE_WIDTH = 794;
    const PAGE_HEIGHT = 1123;
    const MARGIN = 50;
    
    // State
    let state = {
        text: textInput.value,
        font: fontSelect.value,
        size: parseInt(sizeInput.value),
        spacing: parseFloat(lineSpacingInput.value),
        colorHex: colorInput.value,
        opacity: parseFloat(opacityInput.value),
        showGuides: guideCheckbox.checked,
        showWatermark: watermarkCheckbox.checked,
        align: alignSelect.value
    };

    // Initial draw in case fonts take too long or fail
    drawPages();
    
    // Redraw once fonts actually load
    if (document.fonts) {
        document.fonts.ready.then(() => {
            drawPages();
        });
    }

    // Event Listeners for Controls
    textInput.addEventListener('input', (e) => {
        state.text = e.target.value;
        drawPages();
    });

    fontSelect.addEventListener('change', (e) => {
        state.font = e.target.value;
        drawPages();
    });

    // Custom Dropdown Logic
    const fontDropdownSelected = document.getElementById('fontDropdownSelected');
    const fontDropdownOptions = document.getElementById('fontDropdownOptions');
    
    fontDropdownSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        fontDropdownOptions.classList.toggle('show');
    });

    fontDropdownOptions.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            const val = li.getAttribute('data-value');
            const text = li.textContent;
            const fontStyle = li.style.fontFamily;
            
            fontDropdownSelected.innerHTML = `<span style="font-family: ${fontStyle}; font-size: 1.4rem;">${text}</span>`;
            fontSelect.value = val;
            fontSelect.dispatchEvent(new Event('change'));
            fontDropdownOptions.classList.remove('show');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            fontDropdownOptions.classList.remove('show');
        }
    });

    sizeInput.addEventListener('input', (e) => {
        state.size = parseInt(e.target.value);
        sizeVal.textContent = `${state.size}px`;
        drawPages();
    });

    lineSpacingInput.addEventListener('input', (e) => {
        state.spacing = parseFloat(e.target.value);
        lineSpacingVal.textContent = `${state.spacing.toFixed(1)}x`;
        drawPages();
    });

    colorInput.addEventListener('input', (e) => {
        state.colorHex = e.target.value;
        drawPages();
    });

    opacityInput.addEventListener('input', (e) => {
        state.opacity = parseFloat(e.target.value);
        opacityVal.textContent = `${Math.round(state.opacity * 100)}%`;
        drawPages();
    });

    guideCheckbox.addEventListener('change', (e) => {
        state.showGuides = e.target.checked;
        drawPages();
    });

    watermarkCheckbox.addEventListener('change', (e) => {
        state.showWatermark = e.target.checked;
        drawPages();
    });

    alignSelect.addEventListener('change', (e) => {
        state.align = e.target.value;
        drawPages();
    });

    // --- Helper Functions ---
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    }

    function createPageCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = PAGE_WIDTH;
        canvas.height = PAGE_HEIGHT;
        canvas.className = 'page-canvas';
        const ctx = canvas.getContext('2d');
        // Initial white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
        
        if (state.showWatermark) {
            ctx.save();
            ctx.font = '12px Inter, sans-serif';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.textAlign = 'right';
            ctx.fillText('tinyfont.me/calligraphy-sheets-generator/', PAGE_WIDTH - 20, PAGE_HEIGHT - 20);
            ctx.restore();
        }
        
        return { canvas, ctx };
    }

    function getWrappedLines(text, maxWidth, testCtx) {
        const paragraphs = text.split('\n');
        const lines = [];

        paragraphs.forEach(paragraph => {
            if (paragraph.length === 0) {
                lines.push("");
                return;
            }

            let currentLine = '';
            const words = paragraph.split(' ');

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                // Add a space if currentLine is not empty
                const testLine = currentLine.length === 0 ? word : currentLine + ' ' + word;
                const metrics = testCtx.measureText(testLine);

                if (metrics.width > maxWidth && currentLine.length > 0) {
                    // The word doesn't fit, push the current line and start a new one
                    lines.push(currentLine);
                    currentLine = word;
                } else if (metrics.width > maxWidth && currentLine.length === 0) {
                    // Edge case: A single word is wider than the entire page (e.g. continuous alphabet)
                    // Fallback to character wrapping for this specific long word
                    let tempLine = '';
                    for (let j = 0; j < word.length; j++) {
                        const char = word[j];
                        const tempTest = tempLine + char;
                        if (testCtx.measureText(tempTest).width > maxWidth && tempLine.length > 0) {
                            lines.push(tempLine);
                            tempLine = char;
                        } else {
                            tempLine = tempTest;
                        }
                    }
                    currentLine = tempLine;
                } else {
                    // Word fits, add it to the line
                    currentLine = testLine;
                }
            }
            if (currentLine) {
                lines.push(currentLine);
            }
        });
        return lines;
    }

    // --- Drawing Logic ---
    function drawPages() {
        // Clear all existing pages
        pdfContent.innerHTML = '';
        
        // We need a dummy context just to measure text accurately before creating actual pages
        const dummyCanvas = document.createElement('canvas');
        const dummyCtx = dummyCanvas.getContext('2d');
        dummyCtx.font = `${state.size}px ${state.font}`;
        
        const contentWidth = PAGE_WIDTH - (MARGIN * 2);
        const lines = getWrappedLines(state.text, contentWidth, dummyCtx);
        const rowHeight = state.size * state.spacing; 
        
        let currentPage = createPageCanvas();
        pdfContent.appendChild(currentPage.canvas);
        
        let currentY = MARGIN + state.size;
        
        // Setup font for first page
        currentPage.ctx.font = `${state.size}px ${state.font}`;
        currentPage.ctx.fillStyle = state.color;
        currentPage.ctx.textBaseline = 'alphabetic';

        lines.forEach(line => {
            // Check if we need a new page
            if(currentY > PAGE_HEIGHT - MARGIN) {
                currentPage = createPageCanvas();
                pdfContent.appendChild(currentPage.canvas);
                currentY = MARGIN + state.size;
                
                // Re-apply styles to new context
                currentPage.ctx.font = `${state.size}px ${state.font}`;
                currentPage.ctx.fillStyle = state.color;
                currentPage.ctx.textBaseline = 'alphabetic';
            }

            if (state.showGuides) {
                drawGuidelines(currentPage.ctx, currentY, contentWidth, MARGIN);
            }

            // Draw Text
            const rgbaColor = `rgba(${hexToRgb(state.colorHex)}, ${state.opacity})`;
            currentPage.ctx.fillStyle = rgbaColor;
            
            let xPos = MARGIN;
            currentPage.ctx.textAlign = state.align;
            if (state.align === 'center') {
                xPos = PAGE_WIDTH / 2;
            } else if (state.align === 'right') {
                xPos = PAGE_WIDTH - MARGIN;
            }
            
            currentPage.ctx.fillText(line, xPos, currentY);

            currentY += rowHeight;
        });

        // Fill the rest of the last page with empty guidelines if enabled
        if (state.showGuides) {
            while (currentY <= PAGE_HEIGHT - MARGIN) {
                drawGuidelines(currentPage.ctx, currentY, contentWidth, MARGIN);
                currentY += rowHeight;
            }
        }
    }

    function drawGuidelines(ctx, baselineY, width, margin) {
        const xStart = margin;
        const xEnd = width + margin;
        
        ctx.save();
        ctx.lineWidth = 1;
        
        // Baseline
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.6)';
        ctx.moveTo(xStart, baselineY);
        ctx.lineTo(xEnd, baselineY);
        ctx.stroke();

        // X-Height line
        const xHeight = state.size * 0.45; 
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(150, 150, 200, 0.6)';
        ctx.setLineDash([5, 5]);
        ctx.moveTo(xStart, baselineY - xHeight);
        ctx.lineTo(xEnd, baselineY - xHeight);
        ctx.stroke();

        // Ascender line
        const ascender = state.size * 0.9;
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(xStart, baselineY - ascender);
        ctx.lineTo(xEnd, baselineY - ascender);
        ctx.stroke();

        // Descender line
        const descender = state.size * 0.35;
        ctx.beginPath();
        ctx.moveTo(xStart, baselineY + descender);
        ctx.lineTo(xEnd, baselineY + descender);
        ctx.stroke();

        // Slant lines
        const slantSpacing = 45;
        const angle = 55 * (Math.PI / 180);
        const dx = (ascender + descender) / Math.tan(angle);
        
        ctx.strokeStyle = 'rgba(150, 150, 200, 0.2)';
        ctx.beginPath();
        for (let x = xStart - dx; x < xEnd + dx; x += slantSpacing) {
            ctx.moveTo(x, baselineY + descender);
            ctx.lineTo(x - dx, baselineY - ascender);
        }
        ctx.stroke();

        ctx.restore();
    }

    // --- Export Functions ---
    
    downloadPdfBtn.addEventListener('click', () => {
        const canvases = pdfContent.querySelectorAll('canvas');
        if (canvases.length === 0) return;

        const originalText = downloadPdfBtn.innerHTML;
        downloadPdfBtn.innerHTML = 'Generating PDF...';
        downloadPdfBtn.disabled = true;

        // setTimeout allows the browser to re-render the button text before heavy PDF processing
        setTimeout(() => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [PAGE_WIDTH, PAGE_HEIGHT]
            });

            canvases.forEach((canvas, index) => {
                if (index > 0) {
                    pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT], 'portrait');
                }
                const imgData = canvas.toDataURL('image/jpeg', 0.98);
                pdf.addImage(imgData, 'JPEG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
            });

            pdf.save('calligraphy-practice-sheets.pdf');

            downloadPdfBtn.innerHTML = originalText;
            downloadPdfBtn.disabled = false;
        }, 100);
    });

    downloadPngBtn.addEventListener('click', () => {
        const canvases = pdfContent.querySelectorAll('canvas');
        if (canvases.length === 0) return;

        const originalText = downloadPngBtn.innerHTML;
        downloadPngBtn.innerHTML = 'Processing...';
        downloadPngBtn.disabled = true;

        if (canvases.length === 1) {
            // Single page: Download as PNG directly
            const link = document.createElement('a');
            link.download = 'calligraphy-sheet.png';
            link.href = canvases[0].toDataURL('image/png');
            link.click();
            
            downloadPngBtn.innerHTML = originalText;
            downloadPngBtn.disabled = false;
        } else {
            // Multiple pages: Create a ZIP file
            const zip = new JSZip();
            canvases.forEach((canvas, index) => {
                const dataUrl = canvas.toDataURL('image/png');
                const base64Data = dataUrl.split(',')[1];
                zip.file(`calligraphy-page-${index + 1}.png`, base64Data, {base64: true});
            });

            zip.generateAsync({type: "blob"}).then(function(content) {
                const link = document.createElement('a');
                link.download = 'calligraphy-sheets.zip';
                link.href = URL.createObjectURL(content);
                link.click();
                
                downloadPngBtn.innerHTML = originalText;
                downloadPngBtn.disabled = false;
            }).catch(e => {
                console.error("Error generating zip:", e);
                downloadPngBtn.innerHTML = originalText;
                downloadPngBtn.disabled = false;
            });
        }
    });

    printBtn.addEventListener('click', () => {
        const canvases = pdfContent.querySelectorAll('canvas');
        if (canvases.length === 0) return;

        let imagesHTML = '';
        canvases.forEach(canvas => {
            imagesHTML += '<img src="' + canvas.toDataURL('image/png') + '">';
        });
        
        const windowContent = `<!DOCTYPE html>
<html>
<head>
    <title>Print Practice Sheets</title>
    <style>
        @page { size: A4; margin: 0; }
        body { margin: 0; padding: 0; background: white; }
        img { 
            display: block;
            width: 100vw; 
            height: 100vh;
            object-fit: contain;
            page-break-after: always; 
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    ${imagesHTML}
</body>
</html>`;
        
        const printWin = window.open('', '', 'width=800,height=900');
        printWin.document.open();
        printWin.document.write(windowContent);
        printWin.document.close();
        
        printWin.onload = function() {
            printWin.focus();
            setTimeout(() => {
                printWin.print();
                printWin.close();
            }, 250); // small delay to ensure images render in print spooler
        };
    });
});
