/**
 * Utility functions for GSAP animations
 */
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Initialize mouse move and ambient floating effects for orbs
 * @param {HTMLElement[]} elements - DOM elements to apply effects to
 * @returns {() => void} Cleanup function to remove event listeners and stop animations
 */
export function initMouseMoveEffect(elements: HTMLElement[]): (() => void) | undefined {
    if (!elements || !window) return
    
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let timeOffset = 0
    const animationFrameId = { current: 0 }
    
    // Update mouse position when mouse moves
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    
    // Initialize per-element animation parameters
    elements.forEach((el, index) => {
      if (!el) return
      
      // Create unique animation parameters for each orb
      el.dataset.baseAmplitudeX = String(5 + Math.random() * 10)
      el.dataset.baseAmplitudeY = String(5 + Math.random() * 10)
      el.dataset.frequencyX = String(0.0005 + Math.random() * 0.0005)
      el.dataset.frequencyY = String(0.0005 + Math.random() * 0.0005)
      el.dataset.phaseX = String(index * Math.PI / 4)
      el.dataset.phaseY = String(index * Math.PI / 3 + Math.PI / 2)
      
      // Initialize position
      el.dataset.x = '0'
      el.dataset.y = '0'
    })
    
    // Animate elements based on mouse position and time
    const animateElements = () => {
      timeOffset += 1
      
      elements.forEach(el => {
        if (!el) return
        
        // Get ambient animation parameters
        const baseAmplitudeX = parseFloat(el.dataset.baseAmplitudeX || '5')
        const baseAmplitudeY = parseFloat(el.dataset.baseAmplitudeY || '5')
        const frequencyX = parseFloat(el.dataset.frequencyX || '0.001')
        const frequencyY = parseFloat(el.dataset.frequencyY || '0.001')
        const phaseX = parseFloat(el.dataset.phaseX || '0')
        const phaseY = parseFloat(el.dataset.phaseY || '0')
        
        // Calculate ambient motion using sine waves
        const ambientX = baseAmplitudeX * Math.sin(timeOffset * frequencyX + phaseX)
        const ambientY = baseAmplitudeY * Math.sin(timeOffset * frequencyY + phaseY)
        
        // Calculate mouse-based motion
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const moveFactorX = (mouseX - centerX) / centerX
        const moveFactorY = (mouseY - centerY) / centerY
        const mouseMoveX = moveFactorX * 20
        const mouseMoveY = moveFactorY * 20
        
        // Apply movement with easing
        const currentX = parseFloat(el.dataset.x || '0')
        const currentY = parseFloat(el.dataset.y || '0')
        const targetX = ambientX + mouseMoveX
        const targetY = ambientY + mouseMoveY
        
        // Smooth interpolation
        const newX = currentX + (targetX - currentX) * 0.05
        const newY = currentY + (targetY - currentY) * 0.05
        
        // Store values
        el.dataset.x = String(newX)
        el.dataset.y = String(newY)
        
        // Use CSS variables for transform
        el.style.setProperty('--orb-translate-x', `${newX}px`)
        el.style.setProperty('--orb-translate-y', `${newY}px`)
      })
      
      // Continue animation loop
      animationFrameId.current = requestAnimationFrame(animateElements)
    }
    
    // Set up event listeners
    window.addEventListener('mousemove', handleMouseMove)
    
    // Start animation loop
    animateElements()
    
    // Return cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId.current)
    }
  }
  
  /**
   * Initialize star twinkling effects
   * @param {SVGElement[]} stars - DOM elements representing stars
   */
  export function initStarTwinkling(stars: SVGElement[]): void {
    if (!stars) return
    
    stars.forEach((star, i) => {
      // Set random delay for CSS animation
      const delay = Math.random() * 5;
      star.style.setProperty('--twinkle-delay', `${delay}s`);
      
      // The animation itself is now handled by CSS in globals.css
      // with the .twinkling-star class and @keyframes twinkle
    })
  }
  
  /**
   * Layer configuration for parallax scrolling
   */
  interface ParallaxLayer {
    element: string | HTMLElement | SVGElement;
    speed: number;
  }
  
  /**
   * Options for parallax scrolling
   */
  interface ParallaxOptions {
    layers: ParallaxLayer[];
    trigger?: string | HTMLElement;
  }
  
  /**
   * Initialize parallax scrolling for multiple layers
   * @param {ParallaxOptions} options - Configuration options
   * @returns {GSAPTimeline | undefined} The GSAP timeline that was created
   */
  export function initParallaxScroll(options: ParallaxOptions) {
    if (!options || !options.layers) return
    
    const { layers, trigger = 'body' } = options
    
    // Create timeline with enhanced scroll effect
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true
      }
    })
    
    // Add layers to timeline with enhanced parallax effect
    layers.forEach(layer => {
      if (!layer.element || !layer.speed) return
      
      // Apply initial transform to create depth
      gsap.set(layer.element, {
        transformOrigin: "center center",
        force3D: true
      })
      
      // Enhanced motion effect
      tl.to(layer.element, {
        y: layer.speed * 250, // Increased movement range
        scale: 1 + (layer.speed * 0.1), // Subtle scale effect for depth
        ease: "none"
      }, 0)
    })
    
    return tl
  }
  
  /**
   * Options for staggered reveal animations
   */
  interface StaggerRevealOptions {
    trigger?: string | HTMLElement;
    start?: string;
    end?: string;
    stagger?: number;
    y?: number;
    duration?: number;
    ease?: string;
  }
  
  /**
   * Initialize staggered reveal animation for multiple elements
   * @param {(string | HTMLElement | SVGElement)[]} elements - DOM elements to animate
   * @param {StaggerRevealOptions} options - Animation options
   */
  export function initStaggerReveal(
    elements: string | (string | HTMLElement | SVGElement)[], // Accept string or array
    options: StaggerRevealOptions = {}
  ): void {
    if (!elements) return
    
    // Convert string to array if needed
    const elementsArray = typeof elements === 'string' 
      ? [elements] 
      : elements;

    // First ensure elements are visible by default
    const targetElements = typeof elementsArray[0] === 'string' 
      ? document.querySelectorAll(elementsArray[0] as string)
      : elementsArray;
    
    gsap.set(targetElements, { opacity: 1 });
    
    // Create animation
    gsap.from(elementsArray, {
      opacity: 0,
      y: options.y || 50,
      stagger: options.stagger || 0.1,
      duration: options.duration || 0.8,
      ease: options.ease || "power2.out",
      scrollTrigger: {
        trigger: options.trigger || elementsArray[0],
        start: options.start || "top 80%",
        end: options.end || "bottom 20%",
        toggleActions: "play none none reverse"
      }
    })
  }
