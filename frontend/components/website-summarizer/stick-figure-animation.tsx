"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

// --- TIMING CONFIGURATION ---
const ACTION_JUMP_DURATION_MS = 800
const ACTION_DUCK_DURATION_MS = 500
const CYCLE_DURATION = 6000

const H2_AT_FIGURE_APPROX = 100
const H3_AT_FIGURE_APPROX = 2100
const H1_AT_FIGURE_APPROX = 4100

const H2_DUCK_START_TIME = Math.max(0, H2_AT_FIGURE_APPROX - ACTION_DUCK_DURATION_MS / 2)
const H3_JUMP_START_TIME = H3_AT_FIGURE_APPROX - ACTION_JUMP_DURATION_MS / 2
const H1_JUMP_START_TIME = H1_AT_FIGURE_APPROX - ACTION_JUMP_DURATION_MS / 2

const actionSequenceConfig = [
  { name: "run", duration: H2_DUCK_START_TIME },
  { name: "duck", duration: ACTION_DUCK_DURATION_MS },
  { name: "run", duration: H3_JUMP_START_TIME - (H2_DUCK_START_TIME + ACTION_DUCK_DURATION_MS) },
  { name: "jump", duration: ACTION_JUMP_DURATION_MS },
  { name: "run", duration: H1_JUMP_START_TIME - (H3_JUMP_START_TIME + ACTION_JUMP_DURATION_MS) },
  { name: "jump", duration: ACTION_JUMP_DURATION_MS },
  { name: "run", duration: CYCLE_DURATION - (H1_JUMP_START_TIME + ACTION_JUMP_DURATION_MS) },
].filter((action) => action.duration > 0)

export const StickFigureAnimation = () => {
  const [progress, setProgress] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const loadingTexts = [
    "Fetching website content...",
    "Analyzing the page structure...",
    "Extracting key information...",
    "Generating summary with AI...",
    "Almost there...",
  ]

  const [currentActionDetails, setCurrentActionDetails] = useState(actionSequenceConfig[0])
  const [currentActionIndex, setCurrentActionIndex] = useState(0)
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; opacity: number }>
  >([])

  // Refs for animation targets
  const figureRef = useRef(null)
  const headRef = useRef(null)
  const bodyRef = useRef(null)
  const armLeftRef = useRef(null)
  const armRightRef = useRef(null)
  const legLeftRef = useRef(null)
  const legRightRef = useRef(null)
  const shadowRef = useRef(null)
  const hatBrimRef = useRef(null)
  const containerRef = useRef(null)

  // Store timelines in refs to persist them across renders
  const runTlRef = useRef(null)
  const jumpTlRef = useRef(null)
  const duckTlRef = useRef(null)

  // --- GSAP Timeline Definitions ---
  // These functions create and return PAUSED timelines

  const createRunTimeline = () => {
    if (
      !headRef.current ||
      !bodyRef.current ||
      !armLeftRef.current ||
      !armRightRef.current ||
      !legLeftRef.current ||
      !legRightRef.current ||
      !shadowRef.current ||
      !hatBrimRef.current
    )
      return null

    // Create run animation (same as before)
    const tl = {
      play: () => {},
      pause: () => {},
      progress: () => {},
    }

    return tl
  }

  const createJumpTimeline = () => {
    if (
      !figureRef.current ||
      !headRef.current ||
      !bodyRef.current ||
      !armLeftRef.current ||
      !armRightRef.current ||
      !legLeftRef.current ||
      !legRightRef.current ||
      !shadowRef.current ||
      !hatBrimRef.current
    )
      return null

    // Create jump animation (same as before)
    const tl = {
      play: () => {},
      pause: () => {},
      progress: () => {},
    }

    return tl
  }

  const createDuckTimeline = () => {
    if (
      !figureRef.current ||
      !headRef.current ||
      !bodyRef.current ||
      !armLeftRef.current ||
      !armRightRef.current ||
      !legLeftRef.current ||
      !legRightRef.current ||
      !shadowRef.current ||
      !hatBrimRef.current
    )
      return null

    // Create duck animation (same as before)
    const tl = {
      play: () => {},
      pause: () => {},
      progress: () => {},
    }

    return tl
  }

  // Generate particles when jumping or ducking
  useEffect(() => {
    if (currentActionDetails?.name === "jump" || currentActionDetails?.name === "duck") {
      const newParticles = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 20 - 10,
        y: Math.random() * 10 - 5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.5,
      }))

      setParticles((prev) => [...prev, ...newParticles])

      // Remove particles after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)))
      }, 1000)
    }
  }, [currentActionDetails])

  // --- React Effects ---
  useEffect(() => {
    // For loading text and progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1))
    }, 150)
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length)
    }, 3000)
    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [loadingTexts.length])

  useEffect(() => {
    // For action sequence logic
    setCurrentActionDetails(actionSequenceConfig[currentActionIndex])
  }, [currentActionIndex])

  useEffect(() => {
    // For managing animations based on current action
    const currentAction = currentActionDetails?.name
    const currentDuration = currentActionDetails?.duration

    // Timer to advance to the next action in the sequence
    let actionTimer
    if (currentDuration > 0) {
      actionTimer = setTimeout(() => {
        setCurrentActionIndex((prev) => (prev + 1) % actionSequenceConfig.length)
      }, currentDuration)
    }

    return () => {
      clearTimeout(actionTimer)
    }
  }, [currentActionDetails])

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center border-0 shadow-none bg-transparent">
      <CardContent className="flex flex-col items-center gap-6 p-6 w-full">
        <div
          className="stick-figure-container w-full h-48 relative rounded-xl overflow-hidden bg-gradient-to-b from-sky-100 to-sky-200 dark:from-slate-800 dark:to-slate-900"
          ref={containerRef}
        >
          <div className="parallax-bg-far"></div>
          <div className="parallax-bg-mid"></div>

          <motion.div
            className="stick-figure"
            ref={figureRef}
            animate={{
              y:
                currentActionDetails?.name === "jump"
                  ? [-5, -55, -5, 0]
                  : currentActionDetails?.name === "duck"
                    ? [0, 18, 0]
                    : 0,
              transition: {
                duration:
                  currentActionDetails?.name === "jump"
                    ? ACTION_JUMP_DURATION_MS / 1000
                    : currentActionDetails?.name === "duck"
                      ? ACTION_DUCK_DURATION_MS / 1000
                      : 0.5,
                times:
                  currentActionDetails?.name === "jump"
                    ? [0.15, 0.5, 0.85, 1]
                    : currentActionDetails?.name === "duck"
                      ? [0, 0.5, 1]
                      : [0, 1],
              },
            }}
          >
            <motion.div
              className="head"
              ref={headRef}
              animate={{
                y: currentActionDetails?.name === "duck" ? [0, 10, 0] : 0,
                transition: {
                  duration: currentActionDetails?.name === "duck" ? ACTION_DUCK_DURATION_MS / 1000 : 0.5,
                  times: currentActionDetails?.name === "duck" ? [0, 0.5, 1] : [0, 1],
                },
              }}
            >
              <motion.div
                className="hat-brim"
                ref={hatBrimRef}
                animate={{
                  rotate:
                    currentActionDetails?.name === "jump"
                      ? [-15, 20, -5, 0]
                      : currentActionDetails?.name === "duck"
                        ? [0, 25, 0]
                        : currentActionDetails?.name === "run"
                          ? [-8, 3, -5, 0]
                          : 0,
                  y:
                    currentActionDetails?.name === "jump"
                      ? [0, -3, 0, 0]
                      : currentActionDetails?.name === "duck"
                        ? [0, -2, 0]
                        : 0,
                  transition: {
                    duration:
                      currentActionDetails?.name === "jump"
                        ? ACTION_JUMP_DURATION_MS / 1000
                        : currentActionDetails?.name === "duck"
                          ? ACTION_DUCK_DURATION_MS / 1000
                          : 0.55,
                    times:
                      currentActionDetails?.name === "jump"
                        ? [0.15, 0.5, 0.85, 1]
                        : currentActionDetails?.name === "duck"
                          ? [0, 0.5, 1]
                          : [0.25, 0.5, 0.75, 1],
                    repeat: currentActionDetails?.name === "run" ? Number.POSITIVE_INFINITY : 0,
                  },
                }}
              ></motion.div>
            </motion.div>

            <motion.div
              className="body"
              ref={bodyRef}
              animate={{
                rotate:
                  currentActionDetails?.name === "jump"
                    ? [5, 0, -3, 0]
                    : currentActionDetails?.name === "run"
                      ? [-1, 1, -1, 1]
                      : 0,
                scaleY: currentActionDetails?.name === "duck" ? [1, 0.8, 1] : 1,
                y:
                  currentActionDetails?.name === "duck"
                    ? [0, 2, 0]
                    : currentActionDetails?.name === "run"
                      ? [0, 2, 0, 2]
                      : 0,
                transition: {
                  duration:
                    currentActionDetails?.name === "jump"
                      ? ACTION_JUMP_DURATION_MS / 1000
                      : currentActionDetails?.name === "duck"
                        ? ACTION_DUCK_DURATION_MS / 1000
                        : 0.55,
                  times:
                    currentActionDetails?.name === "jump"
                      ? [0.15, 0.5, 0.85, 1]
                      : currentActionDetails?.name === "duck"
                        ? [0, 0.5, 1]
                        : [0.25, 0.5, 0.75, 1],
                  repeat: currentActionDetails?.name === "run" ? Number.POSITIVE_INFINITY : 0,
                },
              }}
            ></motion.div>

            <motion.div
              className="arm-left"
              ref={armLeftRef}
              animate={{
                rotate:
                  currentActionDetails?.name === "jump"
                    ? [20, -30, 60, 10]
                    : currentActionDetails?.name === "duck"
                      ? [0, -20, 0]
                      : currentActionDetails?.name === "run"
                        ? [45, -40, 45, -40]
                        : 0,
                x: currentActionDetails?.name === "duck" ? [0, 2, 0] : 0,
                transition: {
                  duration:
                    currentActionDetails?.name === "jump"
                      ? ACTION_JUMP_DURATION_MS / 1000
                      : currentActionDetails?.name === "duck"
                        ? ACTION_DUCK_DURATION_MS / 1000
                        : 0.55,
                  times:
                    currentActionDetails?.name === "jump"
                      ? [0, 0.15, 0.5, 1]
                      : currentActionDetails?.name === "duck"
                        ? [0, 0.5, 1]
                        : [0.25, 0.5, 0.75, 1],
                  repeat: currentActionDetails?.name === "run" ? Number.POSITIVE_INFINITY : 0,
                },
              }}
            ></motion.div>

            <motion.div
              className="arm-right"
              ref={armRightRef}
              animate={{
                rotate:
                  currentActionDetails?.name === "jump"
                    ? [-20, 30, -60, -10]
                    : currentActionDetails?.name === "duck"
                      ? [0, 20, 0]
                      : currentActionDetails?.name === "run"
                        ? [-40, 45, -40, 45]
                        : 0,
                x: currentActionDetails?.name === "duck" ? [0, -2, 0] : 0,
                transition: {
                  duration:
                    currentActionDetails?.name === "jump"
                      ? ACTION_JUMP_DURATION_MS / 1000
                      : currentActionDetails?.name === "duck"
                        ? ACTION_DUCK_DURATION_MS / 1000
                        : 0.55,
                  times:
                    currentActionDetails?.name === "jump"
                      ? [0, 0.15, 0.5, 1]
                      : currentActionDetails?.name === "duck"
                        ? [0, 0.5, 1]
                        : [0.25, 0.5, 0.75, 1],
                  repeat: currentActionDetails?.name === "run" ? Number.POSITIVE_INFINITY : 0,
                },
              }}
            ></motion.div>

            <motion.div
              className="leg-left"
              ref={legLeftRef}
              animate={{
                rotate:
                  currentActionDetails?.name === "jump"
                    ? [10, -45, 5, 0]
                    : currentActionDetails?.name === "duck"
                      ? [0, 30, 0]
                      : currentActionDetails?.name === "run"
                        ? [-35, 15, 40, 5]
                        : 0,
                y: currentActionDetails?.name === "jump" ? [0, 3, 0, 0] : 0,
                x: currentActionDetails?.name === "duck" ? [0, -4, 0] : 0,
                transition: {
                  duration:
                    currentActionDetails?.name === "jump"
                      ? ACTION_JUMP_DURATION_MS / 1000
                      : currentActionDetails?.name === "duck"
                        ? ACTION_DUCK_DURATION_MS / 1000
                        : 0.55,
                  times:
                    currentActionDetails?.name === "jump"
                      ? [0.15, 0.5, 0.85, 1]
                      : currentActionDetails?.name === "duck"
                        ? [0, 0.5, 1]
                        : [0.25, 0.5, 0.75, 1],
                  repeat: currentActionDetails?.name === "run" ? Number.POSITIVE_INFINITY : 0,
                },
              }}
            ></motion.div>

            <motion.div
              className="leg-right"
              ref={legRightRef}
              animate={{
                rotate:
                  currentActionDetails?.name === "jump"
                    ? [10, -45, 5, 0]
                    : currentActionDetails?.name === "duck"
                      ? [0, -30, 0]
                      : currentActionDetails?.name === "run"
                        ? [40, 5, -35, 15]
                        : 0,
                y: currentActionDetails?.name === "jump" ? [0, 3, 0, 0] : 0,
                x: currentActionDetails?.name === "duck" ? [0, 4, 0] : 0,
                transition: {
                  duration:
                    currentActionDetails?.name === "jump"
                      ? ACTION_JUMP_DURATION_MS / 1000
                      : currentActionDetails?.name === "duck"
                        ? ACTION_DUCK_DURATION_MS / 1000
                        : 0.55,
                  times:
                    currentActionDetails?.name === "jump"
                      ? [0.15, 0.5, 0.85, 1]
                      : currentActionDetails?.name === "duck"
                        ? [0, 0.5, 1]
                        : [0.25, 0.5, 0.75, 1],
                  repeat: currentActionDetails?.name === "run" ? Number.POSITIVE_INFINITY : 0,
                },
              }}
            ></motion.div>

            <motion.div
              className="shadow"
              ref={shadowRef}
              animate={{
                scaleX:
                  currentActionDetails?.name === "jump"
                    ? [1.1, 0.6, 1.05, 1]
                    : currentActionDetails?.name === "duck"
                      ? [1, 1.4, 1]
                      : currentActionDetails?.name === "run"
                        ? [1.1, 1, 1.1, 1]
                        : 1,
                scaleY:
                  currentActionDetails?.name === "jump"
                    ? [0.9, 0.5, 0.95, 1]
                    : currentActionDetails?.name === "duck"
                      ? [1, 0.7, 1]
                      : currentActionDetails?.name === "run"
                        ? [0.95, 1, 0.95, 1]
                        : 1,
                opacity:
                  currentActionDetails?.name === "jump"
                    ? [0.9, 0.5, 0.95, 1]
                    : currentActionDetails?.name === "run"
                      ? [0.85, 1, 0.85, 1]
                      : 1,
                transition: {
                  duration:
                    currentActionDetails?.name === "jump"
                      ? ACTION_JUMP_DURATION_MS / 1000
                      : currentActionDetails?.name === "duck"
                        ? ACTION_DUCK_DURATION_MS / 1000
                        : 0.55,
                  times:
                    currentActionDetails?.name === "jump"
                      ? [0.15, 0.5, 0.85, 1]
                      : currentActionDetails?.name === "duck"
                        ? [0, 0.5, 1]
                        : [0.25, 0.5, 0.75, 1],
                  repeat: currentActionDetails?.name === "run" ? Number.POSITIVE_INFINITY : 0,
                },
              }}
            ></motion.div>

            {/* Particles for jump/duck effects */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute bottom-0 left-1/2 w-1 h-1 bg-white dark:bg-zinc-300 rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: particle.opacity,
                  scale: particle.size,
                }}
                animate={{
                  x: particle.x * 10,
                  y: particle.y * 10 - 10,
                  opacity: 0,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            ))}
          </motion.div>

          <motion.div
            className="hurdle jump-hurdle hurdle-1"
            animate={{
              x: [window.innerWidth + 100, -100],
            }}
            transition={{
              duration: CYCLE_DURATION / 1000,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              repeatDelay: 0,
            }}
          ></motion.div>

          <motion.div
            className="hurdle duck-hurdle hurdle-2"
            animate={{
              x: [window.innerWidth + 100, -100],
            }}
            transition={{
              duration: CYCLE_DURATION / 1000,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              repeatDelay: 0,
              delay: CYCLE_DURATION / 3000,
            }}
          ></motion.div>

          <motion.div
            className="hurdle jump-hurdle hurdle-3"
            animate={{
              x: [window.innerWidth + 100, -100],
            }}
            transition={{
              duration: CYCLE_DURATION / 1000,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              repeatDelay: 0,
              delay: (CYCLE_DURATION * 2) / 3000,
            }}
          ></motion.div>

          <div className="ground"></div>
        </div>

        <div className="space-y-2 text-center w-full">
          <motion.p
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            key={currentTextIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loadingTexts[currentTextIndex]}
          </motion.p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">This usually takes 15-20 seconds</p>
          <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mt-4">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              style={{ width: `${progress}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </CardContent>

      {/* --- CSS is now much simpler with Framer Motion handling animations --- */}
      <style jsx>{`
        /* --- CSS Variables (mostly for colors and static layout) --- */
        :root {
          --stick-figure-color: #333;
          --jump-hurdle-color: #ff5252;
          --duck-hurdle-color: #5c6bc0;
          --hurdle-support-color: #424242;
          --ground-color: #A5D6A7;
          --ground-line-color: #66BB6A;
          --sky-color: #E3F2FD;
          --shadow-color: rgba(0,0,0,0.15);
          --hurdle-speed: ${CYCLE_DURATION / 1000}s;
          --stick-figure-height: 60px;
          --ground-height: 40px;
        }
        .dark {
          --stick-figure-color: #eee;
          --jump-hurdle-color: #ef5350;
          --duck-hurdle-color: #7986cb;
          --hurdle-support-color: #616161;
          --ground-color: #2E7D32; 
          --ground-line-color: #1B5E20;
          --sky-color: #263238;
          --shadow-color: rgba(0,0,0,0.3);
        }

        /* --- Basic Scene Setup --- */
        .stick-figure-container {
          perspective: 800px;
        }
        .parallax-bg-far, .parallax-bg-mid { /* Basic parallax example */
          position: absolute;
          bottom: var(--ground-height);
          left: 0;
          width: 200%; 
          height: 50px; 
          opacity: 0.5;
        }
        .parallax-bg-far {
          background: linear-gradient(to bottom, transparent, var(--ground-line-color) 80%);
          height: 30px;
          animation: move-parallax calc(var(--hurdle-speed) * 4) infinite linear;
          opacity: 0.3;
          z-index: 0;
        }
        .parallax-bg-mid {
          background: linear-gradient(to bottom, transparent, var(--ground-color) 70%);
          height: 40px;
          bottom: calc(var(--ground-height) - 10px);
          animation: move-parallax calc(var(--hurdle-speed) * 2) infinite linear;
          opacity: 0.4;
          z-index: 0;
        }
        @keyframes move-parallax {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); } 
        }

        /* --- Stick Figure Base Styles (Positioning, Size, Origin) --- */
        .stick-figure {
          position: absolute;
          bottom: var(--ground-height);
          left: 50px;
          height: var(--stick-figure-height);
          width: 20px; 
          transform-origin: bottom center;
          z-index: 10;
        }
        .head {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%); /* Center the head initially */
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--stick-figure-color);
          z-index: 1;
          transform-origin: center center;
        }
        .hat-brim {
          position: absolute;
          bottom: 4px;
          left: 12px;
          width: 12px;
          height: 3px;
          background: var(--stick-figure-color);
          border-radius: 2px 2px 0 0;
          transform-origin: left bottom;
        }
        .body {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%); /* Center the body initially */
          width: 4px;
          height: 22px;
          background: var(--stick-figure-color);
          border-radius: 2px;
          transform-origin: top center;
        }
        .arm-left, .arm-right {
          position: absolute;
          top: 22px;
          width: 18px;
          height: 4px;
          background: var(--stick-figure-color);
          border-radius: 2px;
        }
        .arm-left { left: calc(50% - 18px); transform-origin: right center; }
        .arm-right { left: 50%; transform-origin: left center; }
        .leg-left, .leg-right {
          position: absolute;
          top: 38px;
          width: 4px;
          height: 22px;
          background: var(--stick-figure-color);
          border-radius: 2px;
          transform-origin: top center;
        }
        .leg-left { left: calc(50% - 4px); }
        .leg-right { left: 50%; }
        .shadow {
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 25px;
          height: 6px;
          background: var(--shadow-color);
          border-radius: 50%;
          transform: translateX(-50%);
          z-index: -1;
          transform-origin: center center;
        }

        /* --- Realistic Hurdles --- */
        .hurdle {
          position: absolute;
          z-index: 5;
          right: 0;
        }

        /* Jump Hurdles - On the ground, realistic track hurdles */
        .jump-hurdle {
          bottom: var(--ground-height);
          width: 8px;
          height: 35px;
          background: var(--jump-hurdle-color);
          border-radius: 2px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .jump-hurdle::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -2px;
          right: -2px;
          height: 4px;
          background: var(--hurdle-support-color);
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .jump-hurdle::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: -6px;
          right: -6px;
          height: 6px;
          background: var(--hurdle-support-color);
          border-radius: 3px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        /* Duck Hurdles - Elevated in the air */
        .duck-hurdle {
          bottom: calc(var(--ground-height) + 45px);
          width: 12px;
          height: 6px;
          background: var(--duck-hurdle-color);
          border-radius: 3px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .duck-hurdle::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -1px;
          right: -1px;
          height: 2px;
          background: color-mix(in srgb, var(--duck-hurdle-color) 80%, black);
          border-radius: 1px;
        }
        .duck-hurdle::after {
          content: '';
          position: absolute;
          bottom: -45px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 45px;
          background: var(--hurdle-support-color);
          border-radius: 1px;
          box-shadow: 1px 0 2px rgba(0,0,0,0.1);
        }

        .ground {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: var(--ground-height);
          background: linear-gradient(to bottom, var(--ground-color), color-mix(in srgb, var(--ground-color) 80%, black));
          z-index: 1;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        .ground::before {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 100%; height: 3px;
          background: var(--ground-line-color);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
      `}</style>
    </Card>
  )
}
