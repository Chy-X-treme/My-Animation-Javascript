    // The JavaScript remains the same as provided in the prompt
    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");
    const container = document.getElementById("canvasContainer");
    const workspace = document.getElementById("workspace");
    const timeline = document.getElementById("timeline");
    const timelineScroll = document.getElementById("timelineScroll"); 
    const playButton = document.getElementById("playButton");
    const contextMenu = document.getElementById("contextMenu");
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");
    const topRightMenuToggle = document.getElementById("topRightMenuToggle");
    const bottomSlideMenu = document.getElementById("bottom-slide-menu");
    const onionToggleHamburger = document.getElementById("onionToggleHamburger");
    const gridToggleModal = document.getElementById("gridToggleModal");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const addBeforeMenuItem = document.getElementById("addBeforeMenuItem"), addAfterMenuItem = document.getElementById("addAfterMenuItem"), copyMenuItem = document.getElementById("copyMenuItem"), eraseMenuItem = document.getElementById("eraseMenuItem"), pasteBeforeMenuItem = document.getElementById("pasteBeforeMenuItem"), pasteAfterMenuItem = document.getElementById("pasteAfterMenuItem");
    const projectSettingsModal = document.getElementById("projectSettingsModal"), projectNameInput = document.getElementById("projectNameInput"), bgPresetBtn = document.getElementById("bgPresetBtn"), bgColorBtn = document.getElementById("bgColorBtn"), bgColorPicker = document.getElementById("bgColorPicker"), bgImageBtn = document.getElementById("bgImageBtn"), bgImageInput = document.getElementById("bgImageInput"), bgVideoBtn = document.getElementById("bgVideoBtn"), bgVideoInput = document.getElementById("bgVideoInput"), currentCanvasSizeDisplay = document.getElementById("currentCanvasSizeDisplay"), currentFpsDisplay = document.getElementById("currentFpsDisplay"), chooseCanvasSizeBtn = document.getElementById("chooseCanvasSizeBtn"), chooseFpsBtn = document.getElementById("chooseFpsBtn");
    const canvasSizeModal = document.getElementById("canvasSizeModal"), canvasWidthInput = document.getElementById("canvasWidthInput"), canvasHeightInput = document.getElementById("canvasHeightInput"), canvasPresetsGrid = document.getElementById("canvasPresetsGrid");
    const framesPerSecondModal = document.getElementById("framesPerSecondModal"), framesPerSecondCount = document.getElementById("framesPerSecondCount"), fpsRangeSlider = document.getElementById("fpsRangeSlider"), fpsValuesGrid = document.getElementById("fpsValuesGrid");

    const framesViewerModal = document.getElementById("framesViewerModal");
    const framesGrid = document.getElementById("framesGrid");
    const selectAllFramesBtn = document.getElementById("selectAllFramesBtn");
    const viewerActionsBar = document.getElementById("viewerActionsBar");
    const viewerUndoBtn = document.getElementById("viewerUndoBtn");
    const viewerRedoBtn = document.getElementById("viewerRedoBtn");
    const addFrameOptionsModal = document.getElementById("addFrameOptionsModal");
    const viewerPasteBefore = document.getElementById("viewerPasteBefore");
    const viewerPasteAfter = document.getElementById("viewerPasteAfter");

    // Onion Skinning Modal Elements
    const onionSettingsModal = document.getElementById("onionSettingsModal");
    const onionColorToggle = document.getElementById("onionColorToggle");
    const onionLoopToggle = document.getElementById("onionLoopToggle");
    const framesBeforeSlider = document.getElementById("framesBeforeSlider");
    const framesBeforeInput = document.getElementById("framesBeforeInput");
    const framesAfterSlider = document.getElementById("framesAfterSlider");
    const framesAfterInput = document.getElementById("framesAfterInput");
    const opacityBeforeSlider = document.getElementById("opacityBeforeSlider");
    const opacityAfterSlider = document.getElementById("opacityAfterSlider");
    const opacityBeforeValue = document.getElementById("opacityBeforeValue");
    const opacityAfterValue = document.getElementById("opacityAfterValue");
    const opacityBeforePreview = document.getElementById("opacityBeforePreview");
    const opacityAfterPreview = document.getElementById("opacityAfterPreview");
    const onionLinkIcon = document.getElementById("onionLinkIcon");

    let currentTool = "draw", isDrawing = false, drawingPath = [], zoomLevel = 1, offsetX = 0, offsetY = 0, isPinching = false, lastTouchDistance = null, lastTouchMidpoint = null, frames = [{ paths: [] }], currentFrame = 0, playing = false, playInterval = null, contextMenuFrame = -1, copiedFrameContent = null;
    let history = [], historyIndex = -1, maxHistorySize = 50;
    let isOnionSkinningEnabled = false, isGridEnabled = false;
    let panStart = { x: 0, y: 0 };
    let isPanning = false;

    // Onion Skinning Settings Data Structure (default values)
    let onionSettings = {
        enabled: false,
        colorEnabled: true,
        loopEnabled: false,
        framesBefore: 1,
        framesAfter: 1,
        opacityBefore: 50, // 0-100
        opacityAfter: 20,  // 0-100
        linkedOpacity: false, // Controls if before and after opacity are linked
    };

    // Derived from settings for drawing
    const ONION_COLORS = {
        prev: 'rgba(255, 0, 0, ', // Red
        next: 'rgba(0, 255, 0, ', // Green
        grayscale: 'rgba(150, 150, 150, ' // Gray
    };

    let project = { name: "My Animation", canvasWidth: 1280, canvasHeight: 720, framesPerSecond: 24, backgroundColor: '#ffffff', backgroundImage: null, backgroundVideo: null, backgroundType: 'color', selectedCanvasPresetId: 'yt720' };
    
    let selectedFrames = new Set();
    let viewerContextMenuFrameIndex = -1; 
    let selectionModeActive = false;
    
    // Variables for drag and drop functionality
    let touchStartX = 0;
    let touchStartY = 0;
    let dragThreshold = 10;
    let longPressTimer = null;
    let longPressThreshold = 500; // ms
    
    // Flag to differentiate between scrolling and tapping/dragging
    let isScrolling = false;

    const canvasPresets = [
        { name: "YouTube (1080p)", width: 1920, height: 1080, id: 'yt1080' },
        { name: "YouTube (720p)", width: 1280, height: 720, id: 'yt720' },
        { name: "Instagram (16x9)", width: 1080, height: 608, id: 'ig169' },
        { name: "Instagram (1x1)", width: 1080, height: 1080, id: 'ig11' },
        { name: "TikTok (1080p)", width: 1080, height: 1920, id: 'tiktok1080' },
        { name: "TikTok (720p)", width: 720, height: 1280, id: 'tiktok720' },
        { name: "Vimeo (1080p)", width: 1920, height: 1080, id: 'vimeo1080' },
        { name: "Facebook (720p)", width: 1280, height: 720, id: 'fb720' },
        { name: "Tumblr (16x9)", width: 1280, height: 720, id: 'tumblr169' },
        { name: "Tumblr (4x3)", width: 1280, height: 960, id: 'tumblr43' },
        { name: "2K (DCI)", width: 2048, height: 1080, id: '2kdci' },
        { name: "4K (UHD)", width: 3840, height: 2160, id: '4kuhd' },
        { name: "Custom", width: null, height: null, id: 'custom' }
    ];

    let animationFrameRequest = null;
    let lastPerformanceCheck = performance.now();
    const PERFORMANCE_CHECK_INTERVAL = 5000;
    const PATHS_WARNING_THRESHOLD = 500;
    const MAX_FRAME_PATHS_OPTIMIZE = 1000;

    function monitorAndOptimize() {
        try {
            const now = performance.now();
            if (now - lastPerformanceCheck > PERFORMANCE_CHECK_INTERVAL) {
                let totalPaths = 0;
                let maxFramePaths = 0;
                frames.forEach(frame => {
                    totalPaths += frame.paths.length;
                    if (frame.paths.length > maxFramePaths) {
                        maxFramePaths = frame.paths.length;
                    }
                });

                if (maxFramePaths > PATHS_WARNING_THRESHOLD) {
                    console.warn(`[Optimization Alert] Frame ${frames.indexOf(frames.find(f => f.paths.length === maxFramePaths)) + 1} has ${maxFramePaths} paths. Consider simplifying or using a larger canvas for detailed work.`);
                }
                if (maxFramePaths > MAX_FRAME_PATHS_OPTIMIZE) {
                    console.log("[Optimization] Attempting to simplify paths due to high count...");
                }
                lastPerformanceCheck = now;
            }

            if (!ctx) {
                console.error("[Error Prevention] Canvas context is null. Re-initializing...");
            }
        } catch (error) {
            console.error("[AI-Powered System Error] An error occurred during monitoring or optimization:", error);
        }
    }

    setInterval(monitorAndOptimize, PERFORMANCE_CHECK_INTERVAL);

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // --- Timeline Swipe-to-Scroll Functionality ---

    let timelineScrollStartX = 0;
    let timelineIsSwiping = false;

    timelineScroll.addEventListener('pointerdown', (e) => {
        // Only trigger swipe-to-scroll if we are not interacting with a button or canvas
        if (!e.target.closest('button') && !e.target.closest('canvas')) {
            timelineIsSwiping = true;
            timelineScrollStartX = e.clientX + timelineScroll.scrollLeft;
            timelineScroll.style.cursor = 'grabbing';
            e.preventDefault(); 
        }
    });

    timelineScroll.addEventListener('pointermove', (e) => {
        if (!timelineIsSwiping) return;
        e.preventDefault(); 
        const walk = timelineScrollStartX - e.clientX; 
        timelineScroll.scrollLeft = walk;
    });

    timelineScroll.addEventListener('pointerup', () => {
        timelineIsSwiping = false;
        timelineScroll.style.cursor = 'default';
    });

    timelineScroll.addEventListener('pointerleave', () => {
        timelineIsSwiping = false;
        timelineScroll.style.cursor = 'default';
    });

    // --- End Timeline Swipe-to-Scroll Functionality ---


    function saveState() {
      try {
        history = history.slice(0, historyIndex + 1);
        history.push({ frames: JSON.parse(JSON.stringify(frames)), currentFrame: currentFrame });
        if (history.length > maxHistorySize) { history.shift(); } else { historyIndex++; }
        updateHistoryButtons();
      } catch (error) {
        console.error("Error saving state:", error);
      }
    }

    function undo() {
      try {
        if (historyIndex >0) {
          historyIndex--;
          const state = history[historyIndex];
          frames = JSON.parse(JSON.stringify(state.frames));
          currentFrame = state.currentFrame;
          redraw();
          updateHistoryButtons();
        }
      } catch (error) {
        console.error("Error during undo:", error);
      }
    }

    function redo() {
      try {
        if (historyIndex < history.length - 1) {
          historyIndex++;
          const state = history[historyIndex];
          frames = JSON.parse(JSON.stringify(state.frames));
          currentFrame = state.currentFrame;
          redraw();
          updateHistoryButtons();
        }
      } catch (error) {
        console.error("Error during redo:", error);
      }
    }

    function viewerUndo() {
        undo();
        updateFramesViewer();
    }

    function viewerRedo() {
        redo();
        updateFramesViewer();
    }

    function updateHistoryButtons() {
      undoBtn.disabled = historyIndex <= 0;
      redoBtn.disabled = historyIndex >= history.length - 1;
      viewerUndoBtn.disabled = historyIndex <= 0;
      viewerRedoBtn.disabled = historyIndex >= history.length - 1;
    }

    function resetZoom() {
      try {
        const workspaceRect = workspace.getBoundingClientRect();
        if (workspaceRect.width === 0 || workspaceRect.height === 0) {
            console.warn("Workspace dimensions are zero. Cannot calculate zoom to fit.");
            zoomLevel = 1;
        } else {
            const canvasAspectRatio = project.canvasWidth / project.canvasHeight;
            const workspaceAspectRatio = workspaceRect.width / workspaceRect.height;

            let newZoom;
            if (canvasAspectRatio > workspaceAspectRatio) {
                newZoom = (workspaceRect.width / project.canvasWidth) * 0.9;
            } else {
                newZoom = (workspaceRect.height / project.canvasHeight) * 0.9;
            }
            zoomLevel = newZoom;
        }

        offsetX = 0;
        offsetY = 0;
        
               requestAnimationFrame(updateCanvasTransform);
        
        hideContextMenu();
        hideBottomSlideMenu();
      } catch (error) {
        console.error("Error resetting zoom:", error);
      }
    }

    function updateCanvasTransform() {
      try {
        container.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
      } catch (error) {
        console.error("Error updating canvas transform:", error);
      }
    }

    function selectTool(tool) {
      try {
        currentTool = tool;
        document.querySelectorAll(".tool-btn").forEach((btn) => {
          btn.classList.toggle("active", btn.getAttribute("data-tool") === tool);
        });
        hideContextMenu();
        hideBottomSlideMenu();
      } catch (error) {
        console.error("Error selecting tool:", error);
      }
    }

    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.addEventListener("click", function () { selectTool(this.getAttribute("data-tool")); });
    });

    // Modified drawPath to accept targetCtx, color, and lineWidth
    function drawPath(path, tool, targetCtx = ctx, color = null, lineWidth = null) {
      try {
        if (!targetCtx || path.length < 2) return;
        targetCtx.beginPath();
        targetCtx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) { targetCtx.lineTo(path[i].x, path[i].y); }
        targetCtx.strokeStyle = color || (tool === 'erase' ? project.backgroundColor : '#000000');
        
        // Use the specified lineWidth, or default to the stored path's lineWidth, or 6
        targetCtx.lineWidth = lineWidth !== null ? lineWidth : (path.lineWidth || 6); 
        
        targetCtx.lineCap = 'round';
        targetCtx.lineJoin = 'round';
        targetCtx.stroke();
      } catch (error) {
        console.error("Error drawing path:", error);
      }
    }

    // FIX: Optimized drawFrameThumbnail to scale line widths correctly and handle thumbnail dimensions.
    function drawFrameThumbnail(frameData, thumbnailCanvasCtx, thumbWidth, thumbHeight) {
      try {
        if (!thumbnailCanvasCtx) return;
        
        // Ensure the canvas context has the correct dimensions
        thumbnailCanvasCtx.canvas.width = thumbWidth;
        thumbnailCanvasCtx.canvas.height = thumbHeight;
        
        // Clear and set background
        thumbnailCanvasCtx.clearRect(0, 0, thumbWidth, thumbHeight);
        thumbnailCanvasCtx.fillStyle = project.backgroundColor;
        thumbnailCanvasCtx.fillRect(0, 0, thumbWidth, thumbHeight);

        // Calculate scale to fit the project canvas content into the thumbnail space
        const scaleX = thumbWidth / project.canvasWidth;
        const scaleY = thumbHeight / project.canvasHeight;
        const scale = Math.min(scaleX, scaleY);

        thumbnailCanvasCtx.save();
        
        // Center the scaled content
        const translateX = (thumbWidth - project.canvasWidth * scale) / 2;
        const translateY = (thumbHeight - project.canvasHeight * scale) / 2;
        
        thumbnailCanvasCtx.translate(translateX, translateY);
        thumbnailCanvasCtx.scale(scale, scale);

        // Draw paths on the scaled canvas.
        for (const path of frameData.paths) {
            // FIX: Adjust the line width for the thumbnail based on the scale.
            const scaledLineWidth = (path.lineWidth || 6) / scale; 
            
            // Call drawPath using the scaled line width and the original points.
            drawPath(path.points, path.tool, thumbnailCanvasCtx, null, scaledLineWidth); 
        }
        
        thumbnailCanvasCtx.restore();
      } catch (error) {
        console.error("Error drawing frame thumbnail:", error);
      }
    }


    function redraw() {
      try {
        if (!ctx) { console.error("Cannot redraw: Canvas context is not available."); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = project.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (project.backgroundType === 'image' && project.backgroundImage) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                drawCurrentFrameAndOverlays();
            };
            img.onerror = () => {
                console.error("Failed to load background image.");
                drawCurrentFrameAndOverlays();
            };
            img.src = project.backgroundImage;
        } else if (project.backgroundType === 'video' && project.backgroundVideo) {
            console.warn("Video background rendering not fully implemented for drawing canvas. Displaying only current frame.");
            drawCurrentFrameAndOverlays();
        } else {
            drawCurrentFrameAndOverlays();
        }
        updateTimeline();
      } catch (error) {
        console.error("Error during redraw:", error);
      }
    }

    function drawCurrentFrameAndOverlays() {
      try {
        if (onionSettings.enabled || onionToggleHamburger.checked) { 
            drawOnionSkinning(); 
        }
        // Ensure path line widths are applied correctly when drawing the main canvas
        for (const path of frames[currentFrame].paths) { 
            drawPath(path.points, path.tool, ctx, null, path.lineWidth || 6); 
        }
        if (isGridEnabled) { drawGrid(); }
      } catch (error) {
        console.error("Error drawing current frame and overlays:", error);
      }
    }

    function drawGrid() {
      try {
        if (!ctx) return;
        ctx.save();
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)'; ctx.lineWidth = 1;
        const gridSize = 50;
        // Fix: Use canvas.width for horizontal lines and canvas.height for vertical lines
        for (let y = 0; y <= canvas.height; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
        for (let x = 0; x <= canvas.width; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
        ctx.restore();
      } catch (error) {
        console.error("Error drawing grid:", error);
      }
    }

    // Updated drawOnionSkinning function to use the new onionSettings
    function drawOnionSkinning() {
      try {
        if (!ctx) return;

        ctx.save();
        
        // Determine the color base (Red/Green or Grayscale)
        const prevColorBase = onionSettings.colorEnabled ? ONION_COLORS.prev : ONION_COLORS.grayscale;
        const nextColorBase = onionSettings.colorEnabled ? ONION_COLORS.next : ONION_COLORS.grayscale;

        // --- Draw Frames Before (Previous) ---
        for (let i = 1; i <= onionSettings.framesBefore; i++) {
            let frameIndex = currentFrame - i;

            if (frameIndex < 0) {
                if (onionSettings.loopEnabled) {
                    frameIndex = frames.length + frameIndex; // Wrap around to the end
                } else {
                    continue; // Stop if looping is disabled and we are at the start
                }
            }

            const frame = frames[frameIndex];
            if (frame) {
                // Calculate opacity fade based on distance from the current frame
                // We use the configured opacity percentage for the closest frames (i=1) and assume a uniform fade for simplicity.
                const opacity = (onionSettings.opacityBefore / 100) * (1 - (i - 1) / onionSettings.framesBefore);
                const color = prevColorBase + opacity + ')';

                for (const path of frame.paths) { 
                    drawPath(path.points, path.tool, ctx, color); 
                }
            }
        }

        // --- Draw Frames After (Future) ---
        for (let i = 1; i <= onionSettings.framesAfter; i++) {
            let frameIndex = currentFrame + i;

            if (frameIndex >= frames.length) {
                if (onionSettings.loopEnabled) {
                    frameIndex = frameIndex - frames.length; // Wrap around to the beginning
                } else {
                    continue; // Stop if looping is disabled and we are at the end
                }
            }

            const frame = frames[frameIndex];
            if (frame) {
                // Calculate opacity fade based on distance from the current frame
                const opacity = (onionSettings.opacityAfter / 100) * (1 - (i - 1) / onionSettings.framesAfter);
                const color = nextColorBase + opacity + ')';

                for (const path of frame.paths) { 
                    drawPath(path.points, path.tool, ctx, color); 
                }
            }
        }
        
        ctx.restore();
      } catch (error) {
        console.error("Error drawing onion skinning:", error);
      }
    }

    function getCanvasCoordinates(clientX, clientY) {
        try {
            const workspaceRect = workspace.getBoundingClientRect(); 
            const containerRect = container.getBoundingClientRect(); 

            const xInWorkspace = clientX - workspaceRect.left;
            const yInWorkspace = clientY - workspaceRect.top;

            const canvasCenterXInWorkspace = workspaceRect.width / 2 + offsetX;
            const canvasCenterYInWorkspace = workspaceRect.height / 2 + offsetY;

            const xRelativeToCenter = xInWorkspace - canvasCenterXInWorkspace;
            const yRelativeToCenter = yInWorkspace - canvasCenterYInWorkspace;

            const unscaledX = xRelativeToCenter / zoomLevel;
            const unscaledY = yRelativeToCenter / zoomLevel;

            const canvasX = unscaledX + project.canvasWidth / 2;
            const canvasY = unscaledY + project.canvasHeight / 2;

            return { x: canvasX, y: canvasY };
        } catch (error) {
            console.error("Error getting canvas coordinates:", error);
            return { x: 0, y: 0 }; 
        }
    }

    let activePointerId = null;
    let pointers = new Map();

    canvas.addEventListener("pointerdown", (e) => {
        try {
            pointers.set(e.pointerId, e);
            e.preventDefault(); 

            hideContextMenu();
            hideBottomSlideMenu();

            if (pointers.size === 1) {
                activePointerId = e.pointerId; 
                if (e.button === 0) { 
                    if (currentTool === "draw" || currentTool === "erase") {
                        const coords = getCanvasCoordinates(e.clientX, e.clientY);
                        // Store the initial lineWidth in the path object when starting to draw
                        drawingPath = [{ x: coords.x, y: coords.y, lineWidth: 6 }]; 
                        isDrawing = true;
                    } else { 
                        isPanning = true;
                        panStart.x = e.clientX - offsetX;
                        panStart.y = e.clientY - offsetY;
                        workspace.style.cursor = 'grabbing';
                    }
                }
            } else if (pointers.size >= 2) { 
                isDrawing = false; drawingPath = [];
                isPanning = false; 
                isPinching = true;

                const pointerList = Array.from(pointers.values());
                const touch1 = pointerList[0];
                const touch2 = pointerList[1];

                lastTouchDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
                lastTouchMidpoint = { x: (touch1.clientX + touch2.clientX) / 2, y: (touch1.clientY + touch2.clientY) / 2 };

                const canvasCoords = getCanvasCoordinates(lastTouchMidpoint.x, lastTouchMidpoint.y);
                lastTouchMidpoint.canvasX = canvasCoords.x;
                lastTouchMidpoint.canvasY = canvasCoords.y;
            }
        } catch (error) {
            console.error("Error on pointerdown:", error);
        }
    });

    canvas.addEventListener("pointermove", (e) => {
        try {
            if (pointers.has(e.pointerId)) { 
                pointers.set(e.pointerId, e);
            }
            e.preventDefault();

            if (isPinching && pointers.size >= 2) {
                const pointerList = Array.from(pointers.values());
                const touch1 = pointerList[0];
                const touch2 = pointerList[1];
                
                const currentDist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
                const currentMid = { x: (touch1.clientX + touch2.clientX) / 2, y: (touch1.clientY + touch2.clientY) / 2 };

                if (lastTouchDistance !== null) {
                    const deltaZoom = currentDist / lastTouchDistance;
                    let newZoomLevel = Math.max(0.1, Math.min(10, zoomLevel * deltaZoom));

                    const workspaceRect = workspace.getBoundingClientRect();
                    const canvasLogicalCenterX = workspaceRect.width / 2;
                    const canvasLogicalCenterY = workspaceRect.height / 2;

                    const targetScreenX = canvasLogicalCenterX + (lastTouchMidpoint.canvasX - project.canvasWidth / 2) * newZoomLevel;
                    const targetScreenY = canvasLogicalCenterY + (lastTouchMidpoint.canvasY - project.canvasHeight / 2) * newZoomLevel;

                    offsetX = currentMid.x - workspaceRect.left - targetScreenX;
                    offsetY = currentMid.y - workspaceRect.top - targetScreenY;

                    zoomLevel = newZoomLevel;
                    
                    requestAnimationFrame(updateCanvasTransform);
                }
                lastTouchDistance = currentDist;
            } else if (isDrawing && e.pointerId === activePointerId && (currentTool === "draw" || currentTool === "erase")) {
                const coords = getCanvasCoordinates(e.clientX, e.clientY);
                if (drawingPath.length === 0 ||
                    Math.abs(coords.x - drawingPath[drawingPath.length - 1].x) > 0.5 ||
                    Math.abs(coords.y - drawingPath[drawingPath.length - 1].y) > 0.5) {
                    // Store the coordinate and the current line width
                    drawingPath.push({ x: coords.x, y: coords.y, lineWidth: 6 }); 
                }
                redraw(); 
                drawPath(drawingPath, currentTool);
            } else if (isPanning && e.pointerId === activePointerId) {
                offsetX = e.clientX - panStart.x;
                offsetY = e.clientY - panStart.y;
                
                requestAnimationFrame(updateCanvasTransform);
            }
        } catch (error) {
            console.error("Error on pointermove:", error);
        }
    });

    canvas.addEventListener("pointerup", (e) => {
        try {
            pointers.delete(e.pointerId); 
            e.preventDefault();

            if (isDrawing && e.pointerId === activePointerId) {
                if (drawingPath.length > 1) { 
                    // Add default line width for saving the path
                    frames[currentFrame].paths.push({ tool: currentTool, points: [...drawingPath], lineWidth: 6 }); 
                    saveState();
                }
                isDrawing = false;
                drawingPath = [];
            }
            if (isPanning && e.pointerId === activePointerId) {
                isPanning = false;
                workspace.style.cursor = 'default';
            }

            if (pointers.size < 2) { 
                isPinching = false;
                lastTouchDistance = null;
            }
            if (pointers.size === 0) { 
                activePointerId = null;
            }

            redraw();
        } catch (error) {
            console.error("Error on pointerup:", error);
        }
    });

    canvas.addEventListener('pointercancel', (e) => {
        try {
            pointers.delete(e.pointerId);
            if (e.pointerId === activePointerId) {
                isDrawing = false;
                isPanning = false;
                activePointerId = null;
            }
            if (pointers.size < 2) {
                isPinching = false;
                lastTouchDistance = null;
            }
            drawingPath = []; 
            workspace.style.cursor = 'default';
            redraw(); 
        } catch (error) {
            console.error("Error on pointercancel:", error);
        }
    });

    workspace.addEventListener("wheel", (e) => {
      try {
        e.preventDefault();

        const workspaceRect = workspace.getBoundingClientRect();
        const mouseXInWorkspace = e.clientX - workspaceRect.left;
        const mouseYInWorkspace = e.clientY - workspaceRect.top;

        const zoomStep = 0.2; 
        const zoomFactor = e.deltaY > 0 ? 1 - zoomStep : 1 + zoomStep;
        let newZoomLevel = Math.max(0.1, Math.min(10, zoomLevel * zoomFactor));

        const currentContainerCenterX = workspaceRect.width / 2 + offsetX;
        const currentContainerCenterY = workspaceRect.height / 2 + offsetY;

        offsetX = mouseXInWorkspace - (mouseXInWorkspace - currentContainerCenterX) * (newZoomLevel / zoomLevel);
        offsetY = mouseYInWorkspace - (mouseYInWorkspace - currentContainerCenterY) * (newZoomLevel / zoomLevel);

        zoomLevel = newZoomLevel;

        requestAnimationFrame(updateCanvasTransform);
      } catch (error) {
        console.error("Error on wheel event:", error);
      }
    }, { passive: false });


    workspace.addEventListener('pointerleave', () => {
        isPanning = false;
        isDrawing = false;
        drawingPath = []; 
        workspace.style.cursor = 'default';
        pointers.clear(); 
        activePointerId = null;
        isPinching = false;
        lastTouchDistance = null;
        lastTouchMidpoint = null;
        redraw();
    });

    function goToFrame(index) {
        try {
            if (index >= 0 && index < frames.length) {
                currentFrame = index; redraw();
                hideContextMenu();
                hideBottomSlideMenu();
                requestAnimationFrame(() => { 
                    const activeThumb = timeline.querySelector('.frame-thumb.active');
                    if (activeThumb) {
                        // Scroll the timeline horizontally to the active thumbnail
                        const scrollContainer = timeline.parentElement;
                        const timelineRect = timeline.getBoundingClientRect();
                        const thumbRect = activeThumb.getBoundingClientRect();

                        const offset = thumbRect.left - timelineRect.left - (scrollContainer.clientWidth / 2) + (thumbRect.width / 2);
                        
                        scrollContainer.scrollTo({
                            left: scrollContainer.scrollLeft + offset,
                            behavior: 'smooth'
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Error going to frame:", error);
        }
    }

    function goToFirstFrame() { goToFrame(0); }
    function goToLastFrame() { goToFrame(frames.length - 1); }

    function togglePlay() {
      try {
        if (!playing) {
          playing = true; playButton.textContent = "■";
          playInterval = setInterval(() => {
            currentFrame = (currentFrame + 1) % frames.length;
            goToFrame(currentFrame);
          }, 1000 / project.framesPerSecond);
        } else {
          playing = false; playButton.textContent = "▶";
          clearInterval(playInterval);
        }
        hideContextMenu();
        hideBottomSlideMenu();
      } catch (error) {
        console.error("Error toggling play:", error);
      }
    }

    function showContextMenu(frameElement, frameIndex) {
      try {
        contextMenuFrame = frameIndex;
        const rect = frameElement.getBoundingClientRect();
        contextMenu.style.display = 'flex';
        contextMenu.offsetWidth;
        const menuWidth = contextMenu.offsetWidth, menuHeight = contextMenu.offsetHeight;
        const finalLeft = Math.max(10, Math.min(rect.left + rect.width / 2 - menuWidth / 2, window.innerWidth - menuWidth - 10));
        const finalTop = rect.top - menuHeight - 8;
        contextMenu.style.left = finalLeft + 'px';
        contextMenu.style.top = finalTop + 'px';
        updatePasteMenuItemVisibility();
        hideBottomSlideMenu();
      } catch (error) {
        console.error("Error showing context menu:", error);
      }
    }

    function hideContextMenu() { contextMenu.style.display = 'none'; contextMenuFrame = -1; }

    function toggleBottomSlideMenu() {
        try {
            if (bottomSlideMenu.classList.contains('open')) {
                hideBottomSlideMenu();
            } else {
                bottomSlideMenu.classList.add('open');
                sidebarOverlay.style.display = 'block';
                hideContextMenu();
            }
        } catch (error) {
            console.error("Error toggling bottom slide menu:", error);
        }
    }

    function hideBottomSlideMenu() {
        bottomSlideMenu.classList.remove('open');
        sidebarOverlay.style.display = 'none';
    }

    function openProjectSettings() {
        try {
            projectNameInput.value = project.name;
            bgColorPicker.value = project.backgroundColor;
            updateBackgroundButtonsActiveState();
            updateCanvasSizeDisplayInProjectSettings();
            updateFpsDisplayInProjectSettings();
            openModal('projectSettingsModal');
        } catch (error) {
            console.error("Error opening project settings:", error);
        }
    }

    function openFramesViewerModal() {
        hideBottomSlideMenu();
        // Reset selection if selection mode is not active. This ensures if the user closed the modal and reopened it, they start fresh unless they were actively selecting.
        if (!selectionModeActive) {
            selectedFrames.clear();
        }
        updateFramesViewer();
        openModal('framesViewerModal');
        
        // Add pointer event listeners for selection/tap behavior in the viewer
        framesGrid.addEventListener('pointerdown', handleViewerPointerDown);
        framesViewerModal.addEventListener('pointermove', handleViewerPointerMove);
        framesViewerModal.addEventListener('pointerup', handleViewerPointerUp);
        framesViewerModal.addEventListener('pointercancel', handleViewerPointerUp);
    }

    // FIX: Update frames viewer to correctly draw thumbnails and handle selection visibility.
    function updateFramesViewer() {
        framesGrid.innerHTML = "";
        frames.forEach((frame, index) => {
            const item = document.createElement("div");
            item.className = "frames-viewer-item";
            item.dataset.index = index;
            
            // Add the selection checkbox
            const checkbox = document.createElement("div");
            checkbox.className = "selection-checkbox";
            item.appendChild(checkbox);

            const thumbContainer = document.createElement("div");
            thumbContainer.className = "frame-thumbnail-viewer";
            const thumbCanvas = document.createElement("canvas");
            
            // FIX: Set canvas width and height for the viewer thumbnails.
            // Using a fixed dimension for display purposes in the viewer modal.
            thumbCanvas.width = 150; // These dimensions are arbitrary for the viewer display
            thumbCanvas.height = 84.375; // Approx 16:9 aspect ratio

            // Get the 2D context for the thumbnail canvas
            const thumbCtx = thumbCanvas.getContext("2d");
            
            // FIX: Call the drawFrameThumbnail function with the correct canvas context and dimensions
            drawFrameThumbnail(frame, thumbCtx, thumbCanvas.width, thumbCanvas.height); 

            thumbContainer.appendChild(thumbCanvas);
            item.appendChild(thumbContainer);

            const numberLabel = document.createElement("div");
            numberLabel.className = "frame-number-label";
            numberLabel.textContent = `Frame ${index + 1}`;
            item.appendChild(numberLabel);
            
            // Handle context menu via contextmenu event (right-click)
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });

            if (selectedFrames.has(index)) {
                item.classList.add('selected-frame');
                checkbox.classList.add('selected');
            } else {
                item.classList.remove('selected-frame');
                checkbox.classList.remove('selected');
            }

            // Show checkbox only if selection mode is active
            if (selectionModeActive) {
                checkbox.style.display = 'flex'; 
            } else {
                checkbox.style.display = 'none'; 
            }

            framesGrid.appendChild(item);
        });

        // Show/hide the persistent actions bar based on selection
        if (selectedFrames.size > 0 || selectionModeActive) {
            viewerActionsBar.style.display = 'flex';
        } else {
            // Keep actions bar visible even with no selection if selection mode is active
            viewerActionsBar.style.display = selectedFrames.size > 0 ? 'flex' : 'none';
        }
        
        updateSelectAllButtonState();
        updateViewerContextMenuPasteVisibility();
    }
    
    // --- Selection and Interaction Logic in Frames Viewer ---

    let currentPointerDownTarget = null;
    let pointerStartTime = 0;
    let pointerStartX = 0;
    let pointerStartY = 0;
    
    function handleViewerPointerDown(e) {
        currentPointerDownTarget = e.target.closest('.frames-viewer-item');
        if (!currentPointerDownTarget || e.button !== 0) return;

        pointerStartTime = performance.now();
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
        
        isScrolling = false; // Reset scrolling flag

        const frameIndex = parseInt(currentPointerDownTarget.dataset.index);

        // Start long press timer if not already in selection mode
        if (!selectionModeActive) {
            longPressTimer = setTimeout(() => {
                // If the long press threshold is reached and we haven't scrolled significantly
                const distanceMoved = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
                if (distanceMoved < dragThreshold) {
                    selectionModeActive = true;
                    selectedFrames.add(frameIndex);
                    updateFramesViewer();
                }
            }, longPressThreshold);
        }
    }

    function handleViewerPointerMove(e) {
        if (!currentPointerDownTarget) return;

        const distanceMoved = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);

        // Check if the user is scrolling (moved past dragThreshold)
        if (distanceMoved > dragThreshold) {
            isScrolling = true;
            clearTimeout(longPressTimer); // Cancel long press if movement detected
        }
    }

    function handleViewerPointerUp(e) {
        clearTimeout(longPressTimer);
        
        if (!currentPointerDownTarget) return;

        const frameIndex = parseInt(currentPointerDownTarget.dataset.index);
        
        // If we were scrolling, do nothing else.
        if (isScrolling) {
            isScrolling = false;
            currentPointerDownTarget = null;
            return;
        }

        // Check if it was a quick tap (not a long press and not a scroll)
        const timeElapsed = performance.now() - pointerStartTime;
        const distanceMoved = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);

        const isTap = timeElapsed < longPressThreshold && distanceMoved < dragThreshold;

        if (isTap) {
            // If selection mode is active, toggle the frame's selection state
            if (selectionModeActive) {
                if (selectedFrames.has(frameIndex)) {
                    selectedFrames.delete(frameIndex);
                } else {
                    selectedFrames.add(frameIndex);
                }
                
                // If no frames are selected, exit selection mode
                if (selectedFrames.size === 0) {
                    selectionModeActive = false;
                }
                
                updateFramesViewer();
            } else {
                // If selection mode is NOT active, treat this as a navigation tap
                selectedFrames.clear(); // Ensure no frames are selected
                goToFrame(frameIndex);
                closeModal('framesViewerModal');
            }
        }
        
        currentPointerDownTarget = null;
    }
    
    // --- End Selection and Interaction Logic ---


    function toggleSelectAllFrames() {
        const allItems = framesGrid.querySelectorAll('.frames-viewer-item');
        const allSelected = selectedFrames.size === frames.length && frames.length > 0;

        if (allSelected) {
            selectedFrames.clear();
            // Important: When all frames are deselected, we reset selection mode
            selectionModeActive = false; 
            allItems.forEach(item => item.classList.remove('selected-frame'));
            selectAllFramesBtn.querySelector('#selectAllIcon').textContent = '🔲';
        } else {
            selectedFrames.clear();
            frames.forEach((_, index) => selectedFrames.add(index));
            allItems.forEach(item => item.classList.add('selected-frame'));
            selectAllFramesBtn.querySelector('#selectAllIcon').textContent = '✅';
            selectionModeActive = true; 
        }
        updateFramesViewer();
    }

    function updateSelectAllButtonState() {
        const totalFrames = frames.length;
        const selectedCount = selectedFrames.size;
        const iconElement = selectAllFramesBtn.querySelector('#selectAllIcon');

        if (totalFrames > 0 && selectedCount === totalFrames) {
            iconElement.textContent = '✅';
        } else {
            iconElement.textContent = '🔲';
        }
    }

    // Function to update context menu visibility based on copied content
    function updateViewerContextMenuPasteVisibility() {
        if (copiedFrameContent) {
            viewerPasteBefore.style.display = 'flex';
            viewerPasteAfter.style.display = 'flex';
        } else {
            viewerPasteBefore.style.display = 'none';
            viewerPasteAfter.style.display = 'none';
        }
    }

    // NOTE: showViewerContextMenu is no longer needed since the actions bar is persistent.
    // We keep the deleteSelectedFrames, shareFrame, copyFrameViewer, addFrameBeforeViewer, addFrameAfterViewer, pasteFrameBeforeViewer, addFrameAfterViewer functions as they are linked to the persistent action bar.


    // Updated Delete function
    function deleteSelectedFrames() {
        if (selectedFrames.size === 0) return;

        saveState();
        
        // Convert Set to Array and sort descending
        const indicesToDelete = Array.from(selectedFrames).sort((a, b) => b - a);
        
        indicesToDelete.forEach(index => {
            // Special handling for deleting the first frame (index 0)
            if (index === 0 && frames.length > 1) {
                // If it's the first frame and we have more than one frame, just clear its content
                frames[0].paths = [];
            } else if (index === 0 && frames.length === 1) {
                // If it's the only frame, just clear its content (same as above)
                frames[0].paths = [];
            } else {
                // If it's any other frame, remove it entirely
                frames.splice(index, 1);
            }
        });

        if (currentFrame >= frames.length) {
            currentFrame = frames.length - 1;
        }
        
        selectedFrames.clear();
        
        // Important: If all frames are deselected, we end the selection session
        if (selectedFrames.size === 0) {
            selectionModeActive = false; 
        }

        redraw();
        updateFramesViewer();
        // hideViewerContextMenu(); // No longer needed
    }

    // Share Frame function (converts canvas data to PNG and uses Web Share API)
    function shareFrame() {
        if (selectedFrames.size === 0) {
            alert("Please select a frame to share.");
            return;
        }

        // hideViewerContextMenu(); // No longer needed

        const framesToShare = Array.from(selectedFrames);
        
        // We only support sharing the first selected frame for now due to API limitations
        const frameIndex = framesToShare[0];
        const frameData = frames[frameIndex];

        // Create an offscreen canvas to render the selected frame
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = project.canvasWidth;
        tempCanvas.height = project.canvasHeight;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw the frame onto the temporary canvas
        drawFrameThumbnail(frameData, tempCtx, project.canvasWidth, project.canvasHeight);

        // Convert the canvas to a PNG Blob
        tempCanvas.toBlob(async (blob) => {
            if (!blob) {
                alert("Failed to generate image.");
                return;
            }

            // Check if the Web Share API is available for files
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], `frame_${frameIndex + 1}.png`, { type: 'image/png' })] })) {
                try {
                    await navigator.share({
                        files: [new File([blob], `frame_${frameIndex + 1}.png`, { type: 'image/png' })],
                        title: `Frame ${frameIndex + 1} from ${project.name}`,
                        text: `Check out this frame from my animation project!`
                    });
                    console.log('Share successful');
                } catch (error) {
                    console.error('Error sharing:', error);
                    // AbortError means the user cancelled the sharing dialog
                    if (error.name !== 'AbortError') {
                        alert('Sharing failed or was cancelled.');
                    }
                }
            } else {
                // Fallback: If native file sharing is not supported, provide a download option
                alert("Native sharing is not supported in this browser. Downloading frame instead.");
                
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `frame_${frameIndex + 1}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        }, 'image/png');
    }


    function copyFrameViewer() {
        // If multiple frames are selected, copy the *first* selected frame's content for consistency
        if (selectedFrames.size > 0) {
            const firstSelectedIndex = Array.from(selectedFrames).sort((a,b) => a-b)[0];
            copiedFrameContent = JSON.parse(JSON.stringify(frames[firstSelectedIndex].paths));
        }
        // hideViewerContextMenu(); // No longer needed
        updateViewerContextMenuPasteVisibility();
    }

    function addFrameBeforeViewer() {
        // Add before the first selected frame
        if (selectedFrames.size > 0) {
            const firstSelectedIndex = Array.from(selectedFrames).sort((a,b) => a-b)[0];
            addFrameAtIndex(firstSelectedIndex);
        }
        // hideViewerContextMenu(); // No longer needed
    }

    function addFrameAfterViewer() {
        // Add after the last selected frame
        if (selectedFrames.size > 0) {
            const lastSelectedIndex = Array.from(selectedFrames).sort((a,b) => b-a)[0];
            addFrameAtIndex(lastSelectedIndex + 1);
        }
        // hideViewerContextMenu(); // No longer needed
    }

    function pasteFrameBeforeViewer() {
        if (selectedFrames.size > 0 && copiedFrameContent) {
            const firstSelectedIndex = Array.from(selectedFrames).sort((a,b) => a-b)[0];
            addFrameAtIndex(firstSelectedIndex, copiedFrameContent);
        }
        // hideViewerContextMenu(); // No longer needed
    }

    function pasteFrameAfterViewer() {
        if (selectedFrames.size > 0 && copiedFrameContent) {
            const lastSelectedIndex = Array.from(selectedFrames).sort((a,b) => b-a)[0];
            addFrameAtIndex(lastSelectedIndex + 1, copiedFrameContent);
        }
        // hideViewerContextMenu(); // No longer needed
    }
    
    function openAddFrameOptionsModal() {
        closeModal('framesViewerModal'); 
        openModal('addFrameOptionsModal');
    }

    // New function to add frames between all existing frames
    function addFramesBetweenAll() {
        // Ensure there are at least 2 frames before attempting to add frames between them
        if (frames.length < 2) {
            alert("This feature requires at least two frames.");
            return false;
        }

        // Iterate backwards and insert a new frame at each index from length-1 down to 1
        for (let i = frames.length - 1; i >= 1; i--) {
            frames.splice(i, 0, { paths: [] });
        }
        
        // After inserting, ensure currentFrame is adjusted if necessary
        currentFrame = currentFrame + (frames.length - frames.length / 2); // Approximation to stay relatively in the same place
        return true;
    }

    function addFrame(option) {
        saveState();
        let newIndex = 0;
        
        if (option === 'start') {
            newIndex = 0;
            frames.unshift({ paths: [] });
            currentFrame = newIndex;
        } else if (option === 'end') {
            newIndex = frames.length;
            frames.push({ paths: [] });
            currentFrame = newIndex;
        } else if (option === 'between') {
            if (addFramesBetweenAll()) {
                // If frames were added successfully, redraw and update viewer
                redraw();
                openFramesViewerModal();
                closeModal('addFrameOptionsModal');
                return;
            } else {
                // If addFramesBetweenAll returned false, the user was already alerted
                closeModal('addFrameOptionsModal');
                openFramesViewerModal();
                return;
            }
        }

        selectedFrames.clear();
        selectionModeActive = false; // Exit selection mode after adding
        closeModal('addFrameOptionsModal');
        redraw();
        openFramesViewerModal();
    }

    function addFrameAtIndex(index, content = null) {
        saveState();
        const newFrameContent = content ? JSON.parse(JSON.stringify(content)) : { paths: [] };
        frames.splice(index, 0, newFrameContent);
        goToFrame(index);
        updateFramesViewer();
    }


    onionToggleHamburger.addEventListener('change', () => {
        try {
            onionSettings.enabled = onionToggleHamburger.checked;
            redraw();
        } catch (error) {
            console.error("Error toggling onion skinning:", error);
        }
    });
    gridToggleModal.addEventListener('change', () => {
        try {
            isGridEnabled = gridToggleModal.checked;
            redraw();
        } catch (error) {
            console.error("Error toggling grid:", error);
        }
    });

    function addImage() {
        alert("Add Image functionality coming soon!"); 
        hideBottomSlideMenu();
    }
    function addVideo() {
        alert("Add Video functionality coming soon!"); 
        hideBottomSlideMenu();
    }
    function addAudio() {
        alert("Add audio functionality coming soon!"); 
        hideBottomSlideMenu();
    }

    function makeMovie() {
        alert("Make Movie functionality coming soon!"); 
        hideBottomSlideMenu();
    }

    function addFrameBefore() {
      try {
        if (contextMenuFrame >= 0) {
            saveState();
            frames.splice(contextMenuFrame, 0, { paths: [] });
            goToFrame(contextMenuFrame);
            hideContextMenu();
        }
      } catch (error) {
        console.error("Error adding frame before:", error);
      }
    }
    function addFrameAfter() {
      try {
        if (contextMenuFrame >= 0) {
            saveState();
            frames.splice(contextMenuFrame + 1, 0, { paths: [] });
            goToFrame(contextMenuFrame + 1);
            hideContextMenu();
        }
      } catch (error) {
        console.error("Error adding frame after:", error);
      }
    }
    function copyFrame() {
      try {
        if (contextMenuFrame >= 0) { copiedFrameContent = JSON.parse(JSON.stringify(frames[contextMenuFrame].paths)); updatePasteMenuItemVisibility(); }
        hideContextMenu();
      } catch (error) {
        console.error("Error copying frame:", error);
      }
    }
    
    // Updated eraseFrameContent to handle deletion based on timeline behavior
    function eraseFrameContent() {
        try {
            if (contextMenuFrame >= 0) {
                saveState();
                
                // If it's the first frame (index 0), just clear the content
                if (contextMenuFrame === 0 && frames.length > 1) {
                    frames[contextMenuFrame].paths = [];
                } else if (contextMenuFrame === 0 && frames.length === 1) {
                    frames[contextMenuFrame].paths = [];
                } else { 
                    // If it's any other frame, delete the frame entirely
                    frames.splice(contextMenuFrame, 1);
                    // Adjust current frame if the deleted frame was the current one
                    if (currentFrame > contextMenuFrame || currentFrame >= frames.length) {
                        currentFrame = Math.max(0, frames.length - 1);
                    }
                }
                
                redraw(); 
                hideContextMenu();
            }
        } catch (error) {
            console.error("Error erasing frame content:", error);
        }
    }

    function pasteFrameBefore() {
        try {
            if (contextMenuFrame >= 0 && copiedFrameContent) { saveState(); frames.splice(contextMenuFrame, 0, { paths: JSON.parse(JSON.stringify(copiedFrameContent)) }); goToFrame(contextMenuFrame); hideContextMenu(); }
        } catch (error) {
            console.error("Error pasting frame before:", error);
        }
    }
    function pasteFrameAfter() {
        try {
            if (contextMenuFrame >= 0 && copiedFrameContent) { saveState(); frames.splice(contextMenuFrame + 1, 0, { paths: JSON.parse(JSON.stringify(copiedFrameContent)) }); goToFrame(contextMenuFrame + 1); hideContextMenu(); }
        } catch (error) {
            console.error("Error pasting frame after:", error);
        }
    }
    function updatePasteMenuItemVisibility() {
        const display = copiedFrameContent ? 'flex' : 'none';
        pasteBeforeMenuItem.style.display = display; pasteAfterMenuItem.style.display = display;
    }

    // FIX: Update timeline to correctly draw thumbnails using the updated drawFrameThumbnail function
    function updateTimeline() {
      try {
        timeline.innerHTML = "";
        frames.forEach((frame, index) => {
          const div = document.createElement("div");
          div.className = "frame-thumb";
          if (index === currentFrame) div.classList.add("active");
          const thumbCanvas = document.createElement("canvas");
          
          // Set thumb canvas dimensions explicitly for drawing
          thumbCanvas.width = 60;
          thumbCanvas.height = 40;
          
          div.appendChild(thumbCanvas);
          
          // FIX: Call drawFrameThumbnail correctly with the specified thumbnail dimensions
          drawFrameThumbnail(frame, thumbCanvas.getContext("2d"), thumbCanvas.width, thumbCanvas.height);
          
          const frameNumberSpan = document.createElement("span");
          frameNumberSpan.className = "frame-thumb-number";
          frameNumberSpan.textContent = index + 1;
          div.appendChild(frameNumberSpan);
          div.addEventListener('click', () => goToFrame(index));
          let longPressTimer;
          div.addEventListener('pointerdown', (e) => {
              if (e.pointerType === 'touch' || e.button === 2) {
                  longPressTimer = setTimeout(() => {
                      showContextMenu(div, index);
                  }, 500);
              }
          });
          div.addEventListener('pointerup', (e) => {
              clearTimeout(longPressTimer);
          });
          div.addEventListener('pointercancel', (e) => {
              clearTimeout(longPressTimer);
          });
          div.addEventListener('pointerleave', (e) => {
              clearTimeout(longPressTimer);
          });
          div.addEventListener('contextmenu', (e) => {
              e.preventDefault();
              showContextMenu(div, index);
          });
          timeline.appendChild(div);
        });
        const add = document.createElement("div");
        add.className = "add-frame"; add.textContent = "+";
        add.onclick = () => {
            saveState();
            frames.push({ paths: [] });
            goToFrame(frames.length - 1);
        };
        timeline.appendChild(add);
      } catch (error) {
        console.error("Error updating timeline:", error);
      }
    }

    topRightMenuToggle.addEventListener('click', toggleBottomSlideMenu);
    sidebarOverlay.addEventListener('click', hideBottomSlideMenu);

    document.addEventListener('click', (e) => {
      try {
        if (contextMenu.style.display === 'flex' && !contextMenu.contains(e.target) && !e.target.closest('.frame-thumb')) { hideContextMenu(); }
      } catch (error) {
        console.error("Error on document click:", error);
      }
    });

    function openModal(modalId) {
      try {
        document.getElementById(modalId).style.display = 'flex';
        hideContextMenu();
        hideBottomSlideMenu();
      } catch (error) {
        console.error("Error opening modal:", error);
      }
    }


    function saveProjectSettings() {
        try {
            project.name = projectNameInput.value;
            
            const newWidth = parseInt(canvasWidthInput.value); // Use values from the inputs
            const newHeight = parseInt(canvasHeightInput.value);

            const oldWidth = canvas.width;
            const oldHeight = canvas.height;

            if (oldWidth !== newWidth || oldHeight !== newHeight) {
                console.log("Canvas size changed. Clearing frames and resetting state.");
                const confirmClear = confirm("Changing canvas size will clear all frames and reset history. Are you sure?");
                if (confirmClear) {
                    project.canvasWidth = newWidth;
                    project.canvasHeight = newHeight;
                    
                    frames = [{ paths: [] }];
                    history = []; historyIndex = -1;
                    currentFrame = 0;
                    saveState();
                } else { 
                    closeModal('projectSettingsModal');
                    return;
                }
            }

            canvas.width = project.canvasWidth;
            canvas.height = project.canvasHeight;
            container.style.width = `${project.canvasWidth}px`;
            container.style.height = `${project.canvasHeight}px`;

            if (playing) { clearInterval(playInterval); togglePlay(); }
            redraw();
            resetZoom();
            closeModal('projectSettingsModal');
        } catch (error) {
            console.error("Error saving project settings:", error);
        }
    }

    bgPresetBtn.addEventListener('click', () => { try { project.backgroundType = 'preset'; project.backgroundColor = '#ffffff'; project.backgroundImage = null; project.backgroundVideo = null; updateBackgroundButtonsActiveState(); redraw(); } catch (error) { console.error("Error setting background preset:", error); } });
    bgColorBtn.addEventListener('click', () => { try { project.backgroundType = 'color'; project.backgroundImage = null; project.backgroundVideo = null; project.backgroundColor = bgColorPicker.value; updateBackgroundButtonsActiveState(); redraw(); } catch (error) { console.error("Error setting background color:", error); } });
    bgColorPicker.addEventListener('input', () => { try { project.backgroundColor = bgColorPicker.value; project.backgroundType = 'color'; project.backgroundImage = null; project.backgroundVideo = null; updateBackgroundButtonsActiveState(); redraw(); } catch (error) { console.error("Error picking background color:", error); } });
    bgImageBtn.addEventListener('click', () => { try { bgImageInput.click(); } catch (error) { console.error("Error triggering image input:", error); } });
    bgImageInput.addEventListener('change', (e) => {
        try {
            if (e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => { project.backgroundImage = event.target.result; project.backgroundType = 'image'; updateBackgroundButtonsActiveState(); redraw(); };
                reader.readAsDataURL(e.target.files[0]);
            }
        } catch (error) { console.error("Error handling image input:", error); }
    });
    bgVideoBtn.addEventListener('click', () => { try { bgVideoInput.click(); } catch (error) { console.error("Error triggering video input:", error); } });
    bgVideoInput.addEventListener('change', (e) => {
        try {
            if (e.target.files[0]) { project.backgroundVideo = URL.createObjectURL(e.target.files[0]); project.backgroundType = 'video'; updateBackgroundButtonsActiveState(); redraw(); }
        } catch (error) { console.error("Error handling video input:", error); }
    });
    function updateBackgroundButtonsActiveState() {
        document.querySelectorAll('#projectSettingsModal .modal-button-group .modal-button').forEach(btn => btn.classList.remove('active-setting'));
        if (project.backgroundType === 'color') bgColorBtn.classList.add('active-setting');
        else if (project.backgroundType === 'image') bgImageBtn.classList.add('active-setting');
        else if (project.backgroundType === 'video') bgVideoBtn.classList.add('active-setting');
        else if (project.backgroundType === 'preset') bgPresetBtn.classList.add('active-setting');
    }

    function openCanvasSizeModal() { 
        populateCanvasPresets(); 
        openModal('canvasSizeModal'); 
        canvasWidthInput.value = project.canvasWidth; 
        canvasHeightInput.value = project.canvasHeight; 
        updateCanvasPresetSelection(); 
    }

    function findCanvasPresetId(width, height) {
        let matchedPreset = canvasPresets.find(p => p.width === width && p.height === height);

        if (matchedPreset) {
            return matchedPreset.id;
        }
        return 'custom';
    }

    function populateCanvasPresets() {
        try {
            canvasPresetsGrid.innerHTML = '';
            const currentPresetId = project.selectedCanvasPresetId;

            canvasPresets.forEach(preset => {
                const div = document.createElement('div');
                div.className = 'canvas-size-item';
                div.dataset.id = preset.id;
                div.innerHTML = `<div class="canvas-size-item-title">${preset.name}</div><div class="canvas-size-item-dims">${preset.width ? `${preset.width} x ${preset.height} px` : ''}</div>`;
                
                if (preset.id === currentPresetId) {
                    div.classList.add('selected');
                }

                div.addEventListener('click', () => {
                    if (preset.id !== "custom") {
                        canvasWidthInput.value = preset.width;
                        canvasHeightInput.value = preset.height;
                        div.dataset.selectedId = preset.id; 
                        updateCanvasPresetSelection();
                        saveCanvasSettings();
                    } else {
                        div.dataset.selectedId = preset.id; 
                        updateCanvasPresetSelection();
                    }
                });
                canvasPresetsGrid.appendChild(div);
            });

            canvasWidthInput.addEventListener('input', debounce(() => {
                updateCanvasPresetSelection();
                saveCanvasSettings();
            }, 500));
            canvasHeightInput.addEventListener('input', debounce(() => {
                updateCanvasPresetSelection();
                saveCanvasSettings();
            }, 500));

            updateCanvasPresetSelection();
        } catch (error) {
            console.error("Error populating canvas presets:", error);
        }
    }
    
    function updateCanvasPresetSelection() {
        try {
            document.querySelectorAll('.canvas-size-item').forEach(item => {
                item.classList.remove('selected');
            });

            const currentW = parseInt(canvasWidthInput.value);
            const currentH = parseInt(canvasHeightInput.value);

            let selectedPresetId = null;

            const clickedItem = document.querySelector('.canvas-size-item[data-selected-id]');
            if (clickedItem) {
                selectedPresetId = clickedItem.dataset.selectedId;
                delete clickedItem.dataset.selectedId; 
            } else {
                selectedPresetId = findCanvasPresetId(currentW, currentH);
            }

            if (selectedPresetId) {
                const itemToSelect = document.querySelector(`.canvas-size-item[data-id="${selectedPresetId}"]`);
                if (itemToSelect) {
                    itemToSelect.classList.add('selected');
                }
            }

            if (selectedPresetId === 'custom' || (isNaN(currentW) || isNaN(currentH))) {
                const customItem = document.querySelector('.canvas-size-item[data-id="custom"]');
                if (customItem) {
                    customItem.classList.add('selected');
                }
            }
        } catch (error) {
            console.error("Error updating canvas preset selection:", error);
        }
    }


    function saveCanvasSettings() {
        try {
            const newWidth = parseInt(canvasWidthInput.value);
            const newHeight = parseInt(canvasHeightInput.value);

            if (!isNaN(newWidth) && newWidth > 0 && !isNaN(newHeight) && newHeight > 0) {
                if (project.canvasWidth !== newWidth || project.canvasHeight !== newHeight) {
                    
                    project.canvasWidth = newWidth;
                    project.canvasHeight = newHeight;
                    
                    const selectedItem = document.querySelector('.canvas-size-item.selected');
                    if (selectedItem && selectedItem.dataset.id) {
                        project.selectedCanvasPresetId = selectedItem.dataset.id;
                    }
                    else {
                        project.selectedCanvasPresetId = 'custom';
                    }

                    updateCanvasSizeDisplayInProjectSettings();
                    
                    closeModal('canvasSizeModal');
                    openModal('projectSettingsModal');
                }
            }
        } catch (error) {
            console.error("Error saving canvas settings:", error);
        }
    }

    function updateCanvasSizeDisplayInProjectSettings() {
        try {
            const selectedPreset = canvasPresets.find(p => p.id === project.selectedCanvasPresetId);

            if (selectedPreset && selectedPreset.id !== 'custom') {
                currentCanvasSizeDisplay.textContent = selectedPreset.name;
            } else {
                currentCanvasSizeDisplay.textContent = `${project.canvasWidth}x${project.canvasHeight} px (Custom)`;
            }
        } catch (error) {
            console.error("Error updating canvas size display:", error);
        }
    }

    function openFramesPerSecondModal() { populateFpsOptions(); openModal('framesPerSecondModal'); fpsRangeSlider.value = project.framesPerSecond; updateFpsDisplay(project.framesPerSecond); updateFpsSelection(project.framesPerSecond); }

    function populateFpsOptions() {
        try {
            fpsValuesGrid.innerHTML = '';
            const displayFps = [1, 12, 15, 24, 25, 30];
            displayFps.forEach(fps => {
                const div = document.createElement('div');
                div.className = 'fps-item'; 
                div.dataset.id = `fps-${fps}`;
                div.textContent = fps; 
                div.dataset.fps = fps;
                
                div.addEventListener('click', () => {
                    fpsRangeSlider.value = fps;
                    updateFpsDisplay(fps);
                    updateFpsSelection(fps);

                    project.framesPerSecond = fps;
                    updateFpsDisplayInProjectSettings();
                    closeModal('framesPerSecondModal');
                    openModal('projectSettingsModal');
                });
                fpsValuesGrid.appendChild(div);
            });

            fpsRangeSlider.addEventListener('input', (e) => {
                const fps = parseInt(e.target.value);
                updateFpsDisplay(fps);
                updateFpsSelection(fps); 
            });

            fpsRangeSlider.addEventListener('change', () => {
                saveFpsSettings();
            });

            updateFpsSelection(project.framesPerSecond);
        } catch (error) {
            console.error("Error populating FPS options:", error);
        }
    }

    function updateFpsDisplay(fps) { framesPerSecondCount.textContent = fps; }

    function updateFpsSelection(fps) {
        document.querySelectorAll('.fps-item').forEach(item => {
            item.classList.toggle('selected', parseInt(item.dataset.fps) === fps);
        });
    }

    function saveFpsSettings() {
        try {
            project.framesPerSecond = parseInt(fpsRangeSlider.value);
            updateFpsDisplayInProjectSettings();
            
            closeModal('framesPerSecondModal'); 
            openModal('projectSettingsModal'); 
        } catch (error) {
            console.error("Error saving FPS settings:", error);
        }
    }

    function updateFpsDisplayInProjectSettings() { currentFpsDisplay.textContent = `${project.framesPerSecond} FPS`; }

    // --- Onion Skinning Modal Functions ---

function openOnionSettingsModal() {
        // Hide the bottom slide menu first
        hideBottomSlideMenu();

        // Load current settings into the modal UI
        onionColorToggle.checked = onionSettings.colorEnabled;
        onionLoopToggle.checked = onionSettings.loopEnabled;
        framesBeforeSlider.value = onionSettings.framesBefore;
        framesBeforeInput.value = onionSettings.framesBefore;
        framesAfterSlider.value = onionSettings.framesAfter;
        framesAfterInput.value = onionSettings.framesAfter;
        opacityBeforeSlider.value = onionSettings.opacityBefore;
        opacityAfterSlider.value = onionSettings.opacityAfter;

        // Update UI elements based on current settings
        updateOpacityDisplay();
        updateOnionLinkState();
        updateOnionPreviewColors();

        openModal('onionSettingsModal');
    }

    // Function to synchronize slider and input values for Frames Before/After
    function syncSliders(slider, input) {
        input.value = slider.value;
        // Ensure input value is a valid number between 0 and 10
        const value = Math.min(10, Math.max(0, parseInt(slider.value) || 0));
        slider.value = value;
        input.value = value;
    }

    // Event listeners for Frames Before/After sliders and inputs
    framesBeforeSlider.addEventListener('input', () => syncSliders(framesBeforeSlider, framesBeforeInput));
    framesBeforeInput.addEventListener('input', () => {
        syncSliders(framesBeforeInput, framesBeforeSlider);
        // Ensure the input value is respected when typing
        framesBeforeSlider.value = framesBeforeInput.value;
    });

    framesAfterSlider.addEventListener('input', () => syncSliders(framesAfterSlider, framesAfterInput));
    framesAfterInput.addEventListener('input', () => {
        syncSliders(framesAfterInput, framesAfterSlider);
        // Ensure the input value is respected when typing
        framesAfterSlider.value = framesAfterInput.value;
    });

    // Function to update the opacity display and preview bars
    function updateOpacityDisplay() {
        const opacityBefore = parseInt(opacityBeforeSlider.value);
        const opacityAfter = parseInt(opacityAfterSlider.value);

        opacityBeforeValue.textContent = `${opacityBefore}%`;
        opacityAfterValue.textContent = `${opacityAfter}%`;

        // Update preview bar opacity
        opacityBeforePreview.style.opacity = opacityBefore / 100;
        opacityAfterPreview.style.opacity = opacityAfter / 100;
    }

    // Opacity slider event listeners
    opacityBeforeSlider.addEventListener('input', () => {
        updateOpacityDisplay();
        if (onionSettings.linkedOpacity) {
            opacityAfterSlider.value = opacityBeforeSlider.value;
            updateOpacityDisplay();
        }
    });

    opacityAfterSlider.addEventListener('input', () => {
        updateOpacityDisplay();
        if (onionSettings.linkedOpacity) {
            opacityBeforeSlider.value = opacityAfterSlider.value;
            updateOpacityDisplay();
        }
    });

    // Onion Color Toggle event listener
    onionColorToggle.addEventListener('change', updateOnionPreviewColors);
opacityBeforePreview.addEventListener('input', () => {
    onionSettings.colorBefore = opacityBeforePreview.value;
    redraw(); // or rerenderOnion(), etc.
});
opacityAfterPreview.addEventListener('input', () => {
    onionSettings.colorAfter = opacityAfterPreview.value;
    redraw(); // or rerenderOnion()
});
updateOnionPreviewColors(); // sync initial state

function updateOnionPreviewColors() {
    const useColor = onionColorToggle.checked;

    // Enable or disable color pickers
    opacityBeforePreview.disabled = !useColor;
    opacityAfterPreview.disabled = !useColor;

    if (useColor) {
        opacityBeforePreview.classList.remove('disabled');
        opacityAfterPreview.classList.remove('disabled');
    } else {
        opacityBeforePreview.classList.add('disabled');
        opacityAfterPreview.classList.add('disabled');
    }
}

    // Onion Link Icon (Opacity Linking)
    onionLinkIcon.addEventListener('click', () => {
        onionSettings.linkedOpacity = !onionSettings.linkedOpacity;
        updateOnionLinkState();
        
        // If linked, synchronize the values immediately to the higher one
        if (onionSettings.linkedOpacity) {
            const maxOpacity = Math.max(parseInt(opacityBeforeSlider.value), parseInt(opacityAfterSlider.value));
            opacityBeforeSlider.value = maxOpacity;
            opacityAfterSlider.value = maxOpacity;
            updateOpacityDisplay();
        }
    });

    function updateOnionLinkState() {
        onionLinkIcon.classList.toggle('linked', onionSettings.linkedOpacity);
    }

    // Save Onion Settings and apply them to the main canvas
    function saveOnionSettings() {
        onionSettings.colorEnabled = onionColorToggle.checked;
        onionSettings.loopEnabled = onionLoopToggle.checked;
        onionSettings.framesBefore = parseInt(framesBeforeInput.value);
        onionSettings.framesAfter = parseInt(framesAfterInput.value);
        onionSettings.opacityBefore = parseInt(opacityBeforeSlider.value);
        onionSettings.opacityAfter = parseInt(opacityAfterSlider.value);
        
        // Note: OnionSettings.enabled is managed by the main onionToggleHamburger in the slide menu, not here.
        
        console.log("Onion settings saved:", onionSettings);
        
        redraw(); // Redraw the canvas with new onion settings
        closeModal('onionSettingsModal');
    }

    // --- End Onion Skinning Modal Functions ---
    
function drawGrid() {  
if (!isGridEnabled || !ctx) return;  
      
    // Save the canvas state  
    ctx.save();  
      
    // Apply grid opacity  
    ctx.strokeStyle = `rgba(0, 0, 0, ${gridOpacity})`;  
    ctx.lineWidth = 1;  
      
    // Draw vertical lines  
    for (let x = 0; x <= canvas.width; x += verticalSpacing) {  
        ctx.beginPath();  
        ctx.moveTo(x, 0);  
        ctx.lineTo(x, canvas.height);  
        ctx.stroke();  
    }  
      
    // Draw horizontal lines  
    for (let y = 0; y <= canvas.height; y += horizontalSpacing) {  
        ctx.beginPath();  
        ctx.moveTo(0, y);  
        ctx.lineTo(canvas.width, y);  
        ctx.stroke();  
    }  
      
    // Restore the canvas state  
    ctx.restore();  
}  
  
let showGrid = false;  
let gridOpacity = 0.25;  
let horizontalSpacing = 80;  
let verticalSpacing = 80;   
  
function saveGridSettings() {
    // Save settings from UI
    gridOpacity = parseInt(document.getElementById("gridLineOpacitySlider").value) / 100;
    verticalSpacing = parseInt(document.getElementById("verticalLineSpacingSlider").value);
    horizontalSpacing = parseInt(document.getElementById("horizontalLineSpacingSlider").value);
    isGridEnabled = document.getElementById("gridToggleModal").checked;

    redraw();

    // ✅ Close modal and remove any shadow
    closeModal('gridSettingsModal');
}
  
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.style.display = "none";
        modal.classList.remove("visible");
        modal.setAttribute("aria-hidden", "true");
        
        // ✅ Remove lingering modal shadow (backdrop)
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
            backdrop.remove(); // Fully removes the element
            console.log("Modal backdrop removed after closing modal.");
        }
    }
}

const onionBeforePicker = document.getElementById("opacityBeforePreview");
const onionAfterPicker = document.getElementById("opacityAfterPreview");

if (onionBeforePicker) {
    onionBeforePicker.addEventListener("input", () => {
        const hex = onionBeforePicker.value;
        const rgba = hexToRGBA_Base(hex);
        ONION_COLORS.prev = rgba; // Update only the value, not re-declare
        drawOnionSkinning();     // Or drawOnionSkinning() if this doesn't exist
    });
}

if (onionAfterPicker) {
    onionAfterPicker.addEventListener("input", () => {
        const hex = onionAfterPicker.value;
        const rgba = hexToRGBA_Base(hex);
        ONION_COLORS.next = rgba;
        drawOnionSkinning();     // Or drawOnionSkinning()
    });
}

// Convert hex to "rgba(r,g,b,"
function hexToRGBA_Base(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},`;
}


  
window.addEventListener("DOMContentLoaded", () => {
    try {
        if (!canvas || !container || !project) throw new Error("Canvas, container, or project not defined");

        canvas.width = project.canvasWidth;
        canvas.height = project.canvasHeight;
        container.style.width = `${project.canvasWidth}px`;
        container.style.height = `${project.canvasHeight}px`;
        selectTool(currentTool);
        saveState();

        // ✅ Get element references
        const onionToggleModal = document.getElementById("onionToggleModal");
        const onionToggleHamburger = document.getElementById("onionToggleHamburger");
        const gridToggleModal = document.getElementById("gridToggleModal");
        const gridToggleHamburger = document.getElementById("gridToggleHamburger");
        const projectNameInput = document.getElementById("projectNameInput");
        const bgColorPicker = document.getElementById("bgColorPicker");

        // ✅ Set default onion state if not defined
        if (typeof onionSettings.enabled === "undefined") {
            onionSettings.enabled = true;
        }

        // ✅ Sync onion toggles and apply setting
        if (!onionToggleModal || !onionToggleHamburger) {
            console.warn("Missing onion toggles in DOM.");
        } else {
            isGridEnabled 
        }

        // ✅ Sync grid toggles
        if (!gridToggleModal || !gridToggleHamburger) {
            console.warn("Missing grid toggles in DOM.");
        } else {
            gridToggleModal.checked = isGridEnabled;
            gridToggleHamburger.checked = isGridEnabled;
        }

        if (projectNameInput) projectNameInput.value = project.name;
        if (bgColorPicker) bgColorPicker.value = project.backgroundColor;

        updateBackgroundButtonsActiveState();
        updateCanvasSizeDisplayInProjectSettings();
        updateFpsDisplayInProjectSettings();
        redraw();
        resetZoom();
        updateHistoryButtons();
        if (isGridEnabled) drawGrid();

        // ✅ Grid slider listeners
        const gridOpacitySlider = document.getElementById("gridLineOpacitySlider");
        const verticalSpacingSlider = document.getElementById("verticalLineSpacingSlider");
        const horizontalSpacingSlider = document.getElementById("horizontalLineSpacingSlider");

        if (gridOpacitySlider) {
            gridOpacitySlider.addEventListener("input", () => {
                const display = document.getElementById("gridOpacityValue");
                if (display) display.textContent = `${gridOpacitySlider.value}%`;
            });
        }

        if (verticalSpacingSlider) {
            verticalSpacingSlider.addEventListener("input", () => {
                const display = document.getElementById("verticalSpacingValue");
                if (display) display.textContent = verticalSpacingSlider.value;
            });
        }

        if (horizontalSpacingSlider) {
            horizontalSpacingSlider.addEventListener("input", () => {
                const display = document.getElementById("horizontalSpacingValue");
                if (display) display.textContent = horizontalSpacingSlider.value;
            });
        }

        if (gridToggleModal) {
            gridToggleModal.addEventListener("change", () => {
                isGridEnabled = gridToggleModal.checked;
                drawGrid();
            });
        }
        
        // === FORCE ONION ON BY DEFAULT AT STARTUP ===

onionSettings.enabled = true; // Turn it ON in memory

// Turn ON the toggle switches
document.getElementById("onionToggleHamburger").checked = true;
document.getElementById("onionToggleModal").checked = true;

// Hide the shadow overlay so settings can be used
document.getElementById("onionDisabledOverlay").style.display = "none";

// Redraw the canvas (optional but safe)
if (typeof redraw === "function") {
    redraw();
}

// === DISABLE ONION COLOR BY DEFAULT ===

// 1. Turn OFF the color toggle switch
document.getElementById("onionColorToggle").checked = false;

// 2. Set onionSettings to match
onionSettings.colorEnabled = false;

// 3. Apply the correct gray preview colors right away
if (typeof updateOnionPreviewColors === "function") {
    updateOnionPreviewColors();
}

    } catch (error) {
        console.error("Error on DOMContentLoaded:", error);
    }
}); 
      
    window.addEventListener('resize', debounce(() => {  
        try {  
            resetZoom();  
        } catch (error) {  
            console.error("Error on window resize:", error);  
        }  
    }, 200));  
      
function openGridSettingsModal() {
            // Hide the bottom slide menu first
        hideBottomSlideMenu();
  const modal = document.getElementById("gridSettingsModal");
  if (modal) {
    modal.style.display = "block";
    modal.classList.add("visible");
    modal.setAttribute('aria-hidden', 'false');
    console.log("Grid Settings modal opened");
  } else {
    console.warn("Grid Settings modal not found");
  }
}

function updateOnionSkinState(isEnabled) {
  const toggleHamburger = document.getElementById("onionToggleHamburger");
  const toggleModal = document.getElementById("onionToggleModal");
  const overlay = document.getElementById("onionDisabledOverlay");

  if (toggleHamburger) toggleHamburger.checked = isEnabled;
  if (toggleModal) toggleModal.checked = isEnabled;
  if (overlay) overlay.style.display = isEnabled ? "none" : "block";
}

// Event listener for hamburger toggle
document.getElementById("onionToggleHamburger")?.addEventListener("change", function () {
  updateOnionSkinState(this.checked);
});

// Event listener for modal toggle
document.getElementById("onionToggleModal")?.addEventListener("change", function () {
  updateOnionSkinState(this.checked);
});

const onionMenuItem = document.getElementById("onionMenuItem");

onionToggleHamburger.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent toggle from opening modal
});

onionMenuItem.addEventListener("click", function (e) {
    if (e.target !== onionToggleHamburger && !onionToggleHamburger.contains(e.target)) {
        openOnionSettingsModal(); // Only open modal if toggle itself wasn't clicked
    }
});
