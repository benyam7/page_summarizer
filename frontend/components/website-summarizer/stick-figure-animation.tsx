'use client';

import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { gsap } from 'gsap';
// Optional: If you use complex motion paths often
// import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// gsap.registerPlugin(MotionPathPlugin);

const AnimationPhase = {
    LOADING: 'LOADING',
    FETCHED: 'FETCHED',
    IDLE: 'IDLE',
} as const;

export const StickFigureAnimation = () => {
    const [progress, setProgress] = useState(0);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const loadingTexts = [
        'Warming up for the big throw!',
        'Doggy senses are tingling...',
        'Focusing on the stick...',
        'Almost time for zoomies!',
        'Fetching the good data!',
    ];
    const fetchedTexts = ['Got it!', 'Good dog!', 'Success!'];
    const [animationPhase, setAnimationPhase] = useState(
        AnimationPhase.LOADING
    );
    const [hasFetchedObject, setHasFetchedObject] = useState(false);
    const [initialCuesDone, setInitialCuesDone] = useState(false);

    // Properly typed refs
    const animationContainerRef = useRef<HTMLDivElement>(null);
    const dogRef = useRef<HTMLDivElement>(null);
    const dogHeadRef = useRef<HTMLDivElement>(null);
    const dogBodyRef = useRef<HTMLDivElement>(null);
    const dogEarLeftRef = useRef<HTMLDivElement>(null);
    const dogEarRightRef = useRef<HTMLDivElement>(null);
    const dogLegFLRef = useRef<HTMLDivElement>(null);
    const dogLegFRRef = useRef<HTMLDivElement>(null);
    const dogLegBLRef = useRef<HTMLDivElement>(null);
    const dogLegBRRef = useRef<HTMLDivElement>(null);
    const dogTailRef = useRef<HTMLDivElement>(null);
    const handlerRef = useRef<HTMLDivElement>(null);
    const handlerArmRef = useRef<HTMLDivElement>(null);
    const handlerBodyRef = useRef<HTMLDivElement>(null);
    const handlerHeadRef = useRef<HTMLDivElement>(null);
    const handlerTorsoRef = useRef<HTMLDivElement>(null);
    const handlerLegLeftRef = useRef<HTMLDivElement>(null);
    const handlerLegRightRef = useRef<HTMLDivElement>(null);
    const fetchObjectWorldRef = useRef<HTMLDivElement>(null);
    const fetchObjectInHandRef = useRef<HTMLDivElement>(null);
    const objectInMouthRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);

    // Timeline refs with proper GSAP types
    const masterTimelineRef: MutableRefObject<gsap.core.Timeline | null> =
        useRef(null);
    const dogGallopSubTlRef: MutableRefObject<gsap.core.Timeline | null> =
        useRef(null);
    const dogTrotSubTlRef: MutableRefObject<gsap.core.Timeline | null> =
        useRef(null);

    useEffect(() => {
        /* ... (API sim - same logic) ... */
        if (
            initialCuesDone &&
            animationPhase === AnimationPhase.LOADING &&
            !hasFetchedObject
        ) {
            const apiCallDuration = Math.random() * 3000 + 6000; // 6-9 seconds
            const timer = setTimeout(() => {
                setHasFetchedObject(true);
            }, apiCallDuration);
            return () => clearTimeout(timer);
        }
    }, [initialCuesDone, animationPhase, hasFetchedObject]);

    useEffect(() => {
        /* ... (Progress bar & text - same logic) ... */
        let progressIntervalId: NodeJS.Timeout | undefined;
        let textIntervalId: NodeJS.Timeout | undefined;

        if (animationPhase === AnimationPhase.LOADING) {
            progressIntervalId = setInterval(() => {
                setProgress((prev) =>
                    prev >= 95 && !hasFetchedObject && initialCuesDone
                        ? 95
                        : prev >= 100
                        ? 100
                        : prev + 1
                );
            }, 150);
            textIntervalId = setInterval(() => {
                setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
            }, 2000);
        } else if (animationPhase === AnimationPhase.FETCHED) {
            setProgress(100);
            setCurrentTextIndex(0);
        }
        return () => {
            if (progressIntervalId) clearInterval(progressIntervalId);
            if (textIntervalId) clearInterval(textIntervalId);
        };
    }, [
        animationPhase,
        hasFetchedObject,
        initialCuesDone,
        loadingTexts.length,
    ]);

    useEffect(() => {
        const allRefsReady = [
            animationContainerRef,
            dogRef,
            dogHeadRef,
            dogBodyRef,
            dogEarLeftRef,
            dogEarRightRef,
            dogLegFLRef,
            dogLegFRRef,
            dogLegBLRef,
            dogLegBRRef,
            dogTailRef,
            handlerRef,
            handlerArmRef,
            handlerBodyRef,
            handlerHeadRef,
            handlerTorsoRef,
            handlerLegLeftRef,
            handlerLegRightRef,
            fetchObjectWorldRef,
            fetchObjectInHandRef,
            objectInMouthRef,
            backgroundRef,
        ].every((ref) => ref.current);

        if (!allRefsReady) {
            return;
        }

        // Cleanup previous timelines and styles
        if (masterTimelineRef.current) masterTimelineRef.current.kill();
        if (dogGallopSubTlRef.current) dogGallopSubTlRef.current.kill();
        if (dogTrotSubTlRef.current) dogTrotSubTlRef.current.kill();

        gsap.set(
            [
                dogRef.current!,
                dogHeadRef.current!,
                dogBodyRef.current!,
                dogEarLeftRef.current!,
                dogEarRightRef.current!,
                dogLegFLRef.current!,
                dogLegFRRef.current!,
                dogLegBLRef.current!,
                dogLegBRRef.current!,
                dogTailRef.current!,
                handlerRef.current!,
                handlerArmRef.current!,
                handlerBodyRef.current!,
                handlerHeadRef.current!,
                handlerTorsoRef.current!,
                handlerLegLeftRef.current!,
                handlerLegRightRef.current!,
                fetchObjectWorldRef.current!,
                fetchObjectInHandRef.current!,
                objectInMouthRef.current!,
                backgroundRef.current!,
            ],
            { clearProps: 'all' }
        );

        const containerWidth = animationContainerRef.current!.offsetWidth;
        const dogStartX = containerWidth * 0.32;
        const handlerStartX = containerWidth * 0.12;
        const fetchObjectLandX = containerWidth * 0.88;
        const groundOffset = 3;
        const dogGroundY = groundOffset;
        const handlerGroundY = groundOffset;
        const objectGroundY = 120 + groundOffset; // CSS height of stick-like object + ground offset

        masterTimelineRef.current = gsap.timeline({ paused: true });
        const tl = masterTimelineRef.current;

        // === Dog Gallop Cycle ===
        const createDogGallopCycle = () => {
            const gallopTl = gsap.timeline({ repeat: -1, paused: true });
            const cycleDuration = 0.42;
            gallopTl
                .to(
                    dogRef.current!,
                    {
                        y: dogGroundY - 9,
                        duration: cycleDuration * 0.2,
                        ease: 'sine.out',
                    },
                    'gather'
                )
                .to(
                    dogRef.current!,
                    {
                        y: dogGroundY,
                        duration: cycleDuration * 0.3,
                        ease: 'sine.in',
                    },
                    '>'
                )
                .to(
                    dogRef.current!,
                    {
                        y: dogGroundY - 13,
                        duration: cycleDuration * 0.2,
                        ease: 'sine.out',
                    },
                    'extend'
                )
                .to(
                    dogRef.current!,
                    {
                        y: dogGroundY,
                        duration: cycleDuration * 0.3,
                        ease: 'sine.in',
                    },
                    '>'
                );
            gallopTl
                .to(
                    dogBodyRef.current!,
                    {
                        scaleY: 0.9,
                        scaleX: 1.1,
                        skewY: 2,
                        duration: cycleDuration * 0.25,
                        ease: 'sine.inOut',
                    },
                    'gather'
                )
                .to(
                    dogBodyRef.current!,
                    {
                        scaleY: 1.05,
                        scaleX: 0.95,
                        skewY: -3,
                        duration: cycleDuration * 0.25,
                        ease: 'sine.out',
                    },
                    '>'
                )
                .to(
                    dogBodyRef.current!,
                    {
                        scaleY: 0.95,
                        scaleX: 1.05,
                        skewY: 1,
                        duration: cycleDuration * 0.25,
                        ease: 'sine.inOut',
                    },
                    '>'
                )
                .to(
                    dogBodyRef.current!,
                    {
                        scaleY: 1,
                        scaleX: 1,
                        skewY: 0,
                        duration: cycleDuration * 0.25,
                        ease: 'sine.out',
                    },
                    '>'
                );
            gallopTl.to(
                dogHeadRef.current!,
                {
                    rotation: 1,
                    y: '+=0.5',
                    duration: cycleDuration / 4,
                    yoyo: true,
                    repeat: 3,
                    ease: 'sine.inOut',
                },
                0
            );

            const legMovement = (
                leg: Element,
                forwardRot: number,
                backwardRot: number,
                phaseOffset: number
            ) => {
                gallopTl
                    .fromTo(
                        leg,
                        { rotation: backwardRot },
                        {
                            rotation: forwardRot,
                            duration: cycleDuration * 0.4,
                            ease: 'power1.out',
                        },
                        phaseOffset
                    )
                    .to(
                        leg,
                        {
                            rotation: backwardRot,
                            duration: cycleDuration * 0.6,
                            ease: 'power1.in',
                        },
                        '>'
                    );
            };

            legMovement(dogLegBRRef.current!, 75, -60, 0);
            legMovement(dogLegBLRef.current!, 75, -60, cycleDuration * 0.05);
            legMovement(dogLegFRRef.current!, 70, -65, cycleDuration * 0.25);
            legMovement(dogLegFLRef.current!, 70, -65, cycleDuration * 0.3);

            gallopTl.to(
                dogTailRef.current!,
                {
                    rotation: 8,
                    skewY: 4,
                    duration: cycleDuration / 2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'sine.inOut',
                },
                0
            );
            return gallopTl;
        };
        dogGallopSubTlRef.current = createDogGallopCycle();

        // === Dog Trot Cycle ===
        const createDogTrotCycle = () => {
            const trotTl = gsap.timeline({ repeat: -1, paused: true });
            const cycleDuration = 0.38;
            trotTl.to(
                dogRef.current!,
                {
                    y: dogGroundY - 7,
                    duration: cycleDuration / 2,
                    ease: 'sine.out',
                    yoyo: true,
                    repeat: 1,
                },
                0
            );
            trotTl.to(
                dogBodyRef.current!,
                {
                    rotation: 0.5,
                    duration: cycleDuration / 2,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: 1,
                },
                0
            );
            trotTl.to(
                dogHeadRef.current!,
                {
                    rotation: -2,
                    y: '+=1.5',
                    duration: cycleDuration / 2,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: 1,
                },
                0
            );
            trotTl
                .to(
                    [dogLegFRRef.current!, dogLegBLRef.current!],
                    {
                        rotation: 40,
                        duration: cycleDuration / 2,
                        ease: 'power1.out',
                    },
                    0
                )
                .to(
                    [dogLegFRRef.current!, dogLegBLRef.current!],
                    {
                        rotation: -25,
                        duration: cycleDuration / 2,
                        ease: 'power1.in',
                    },
                    '>'
                );
            trotTl
                .to(
                    [dogLegFLRef.current!, dogLegBRRef.current!],
                    {
                        rotation: 40,
                        duration: cycleDuration / 2,
                        ease: 'power1.out',
                    },
                    cycleDuration / 2
                )
                .to(
                    [dogLegFLRef.current!, dogLegBRRef.current!],
                    {
                        rotation: -25,
                        duration: cycleDuration / 2,
                        ease: 'power1.in',
                    },
                    '>'
                );
            trotTl.to(
                dogTailRef.current!,
                {
                    rotation: 35,
                    duration: cycleDuration / 3,
                    yoyo: true,
                    repeat: 2,
                    ease: 'sine.inOut',
                },
                0
            );
            return trotTl;
        };
        dogTrotSubTlRef.current = createDogTrotCycle();

        // --- TIMELINE SEGMENTS ---
        tl.set(dogRef.current!, {
            x: dogStartX,
            y: dogGroundY,
            scaleX: 1,
            rotationY: 0,
        })
            .set(handlerRef.current!, {
                x: handlerStartX,
                y: handlerGroundY,
                scaleX: 1,
                rotationY: 0,
            })
            .set(handlerTorsoRef.current!, { rotation: 0, skewX: 0 })
            .set(handlerArmRef.current!, { rotation: 15, y: 0 }) // Arm slightly relaxed
            .set(fetchObjectInHandRef.current!, { opacity: 1, y: 0 })
            .set(fetchObjectWorldRef.current!, {
                opacity: 0,
                x: handlerStartX + 30,
                y: 50 + handlerGroundY,
            })
            .set(objectInMouthRef.current!, { opacity: 0 })
            .set(backgroundRef.current!, { x: 0 });

        tl.to(
            dogTailRef.current!,
            {
                rotation: 28,
                duration: 0.15,
                yoyo: true,
                repeat: 7,
                ease: 'sine.inOut',
            },
            'sceneStart'
        )
            .to(
                dogHeadRef.current!,
                { rotation: -18, y: '-=2.5', duration: 0.4, ease: 'sine.out' },
                'sceneStart'
            )
            .to(
                [dogEarLeftRef.current!, dogEarRightRef.current!],
                {
                    rotation: (i: number) => (i === 0 ? -35 : 35),
                    duration: 0.2,
                    ease: 'sine.out',
                },
                'sceneStart'
            );

        // === Segment 1: Handler Cues & Throw ===
        tl.addLabel('handlerCuesStart', '>-0.3'); // Overlap slightly
        // 1. Object Presentation (show dog the stick)
        tl.to(
            handlerHeadRef.current!,
            { rotation: 22, duration: 0.4, ease: 'sine.inOut' },
            'handlerCuesStart+=0.2'
        )
            .to(
                handlerTorsoRef.current!,
                { rotation: 8, skewX: -4, duration: 0.5, ease: 'power1.out' },
                'handlerCuesStart+=0.2'
            )
            .to(
                handlerArmRef.current!,
                {
                    rotation: -50,
                    x: '+=8',
                    y: '+=3',
                    duration: 0.6,
                    ease: 'back.out(1.2)',
                },
                'handlerCuesStart+=0.3'
            )
            .to(
                dogHeadRef.current!,
                {
                    rotation: -22,
                    y: '+=2.5',
                    duration: 0.4,
                    ease: 'sine.inOut',
                },
                'handlerCuesStart+=0.5'
            );

        // 2. Pointing / Gaze Shift (more decisive)
        tl.addLabel('pointing', '>+0.5')
            .to(
                handlerHeadRef.current!,
                { rotation: -12, duration: 0.5, ease: 'sine.inOut' },
                'pointing'
            )
            .to(
                handlerTorsoRef.current!,
                {
                    rotation: -12,
                    skewX: 6,
                    duration: 0.6,
                    ease: 'power1.inOut',
                },
                'pointing'
            )
            .to(
                handlerArmRef.current!,
                {
                    rotation: 35,
                    x: '-=5',
                    y: '-=8',
                    duration: 0.5,
                    ease: 'power2.out',
                },
                'pointing+=0.1'
            )
            .to(
                dogHeadRef.current!,
                { rotation: 12, y: '-=1.5', duration: 0.4, ease: 'sine.inOut' },
                'pointing+=0.3'
            );

        // 3. Throwing Motion (Wind up - more power, weight shift on legs)
        tl.addLabel('windup', '>+0.4')
            .to(
                handlerLegLeftRef.current!,
                { scaleY: 0.9, rotation: -5, duration: 0.4, ease: 'power1.in' },
                'windup'
            ) // Weight on back leg
            .to(
                handlerLegRightRef.current!,
                { scaleY: 1, rotation: 10, duration: 0.4, ease: 'power1.in' },
                'windup'
            ) // Front leg straightens/lifts heel
            .to(
                handlerTorsoRef.current!,
                {
                    rotation: -30,
                    skewX: 18,
                    y: '-=3',
                    duration: 0.45,
                    ease: 'power2.in',
                },
                'windup'
            )
            .to(
                handlerHeadRef.current!,
                { rotation: 8, duration: 0.45, ease: 'power1.in' },
                'windup'
            )
            .to(
                handlerArmRef.current!,
                {
                    rotation: -120,
                    y: '+=12',
                    x: '-=5',
                    duration: 0.45,
                    ease: 'power2.in',
                },
                'windup'
            )
            .to(
                dogRef.current!,
                { y: dogGroundY + 6, duration: 0.25, ease: 'power1.in' },
                'windup+=0.15'
            )
            .to(
                dogBodyRef.current!,
                {
                    scaleY: 0.82,
                    scaleX: 1.08,
                    duration: 0.25,
                    ease: 'power1.in',
                },
                '<'
            )
            .to(
                dogTailRef.current!,
                { rotation: -8, duration: 0.25, ease: 'power1.in' },
                '<'
            );

        // 4. Throw (Explosive release and follow-through)
        const throwReleaseTime = 'throwAction+=0.1'; // When stick leaves hand
        tl.addLabel('throwAction', '>')
            .to(
                handlerLegLeftRef.current!,
                { scaleY: 1, rotation: 0, duration: 0.3, ease: 'power2.out' },
                'throwAction'
            ) // Push off back leg
            .to(
                handlerLegRightRef.current!,
                {
                    scaleY: 0.95,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                },
                'throwAction'
            ) // Brace on front leg
            .to(
                handlerTorsoRef.current!,
                {
                    rotation: 25,
                    skewX: -12,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                },
                'throwAction'
            )
            .to(
                handlerArmRef.current!,
                {
                    rotation: 60,
                    y: '-=18',
                    x: '+=8',
                    duration: 0.3,
                    ease: 'power2.out',
                },
                'throwAction'
            )
            .to(
                handlerHeadRef.current!,
                { rotation: -18, duration: 0.3, ease: 'power2.out' },
                'throwAction'
            )
            .set(
                fetchObjectInHandRef.current!,
                { opacity: 0 },
                throwReleaseTime
            )
            .set(
                fetchObjectWorldRef.current!,
                {
                    opacity: 1,
                    x: () => {
                        const handlerX = Number(
                            gsap.getProperty(handlerRef.current!, 'x')
                        );
                        const armRotation = Number(
                            gsap.getProperty(handlerArmRef.current!, 'rotation')
                        );
                        return (
                            handlerX +
                            40 +
                            Math.sin((armRotation * Math.PI) / 180) * 30
                        );
                    },
                    y: () => {
                        const handlerY = Number(
                            gsap.getProperty(handlerRef.current!, 'y')
                        );
                        const armRotation = Number(
                            gsap.getProperty(handlerArmRef.current!, 'rotation')
                        );
                        return (
                            handlerY +
                            30 -
                            Math.cos((armRotation * Math.PI) / 180) * 30
                        );
                    },
                    rotation: -45,
                },
                throwReleaseTime
            )
            .to(
                fetchObjectWorldRef.current!,
                {
                    duration: 1.1,
                    ease: 'power1.out',
                    motionPath: {
                        path: [
                            {
                                x: handlerStartX + containerWidth * 0.4,
                                y: handlerGroundY - 60,
                            },
                            { x: fetchObjectLandX, y: objectGroundY },
                        ],
                        curviness: 1.1,
                        align: fetchObjectWorldRef.current!,
                        alignOrigin: [0.5, 0.5],
                    },
                    rotation: '+=820', // Spin
                },
                throwReleaseTime
            )
            .to(
                handlerArmRef.current!,
                { rotation: 80, y: '-=5', duration: 0.5, ease: 'circ.out' },
                'throwAction+=0.3'
            ) // Follow through
            .to(
                handlerTorsoRef.current!,
                { rotation: 15, skewX: 0, duration: 0.5, ease: 'circ.out' },
                'throwAction+=0.3'
            )

            // Dog's launch
            .to(
                dogRef.current!,
                {
                    y: dogGroundY - 12,
                    x: `+=${containerWidth * 0.05}`,
                    duration: 0.25,
                    ease: 'power2.out',
                },
                'throwAction+=0.05'
            ) // Dog anticipates earlier
            .to(
                dogBodyRef.current!,
                {
                    scaleY: 1.15,
                    scaleX: 0.85,
                    duration: 0.25,
                    ease: 'power2.out',
                },
                '<'
            )
            .add(() => {
                if (dogGallopSubTlRef.current)
                    dogGallopSubTlRef.current.play(0);
            }, '>-0.05') // Start gallop as dog lands from initial jump
            .add(() => setInitialCuesDone(true), '>');

        // === Segment 2: Dog Runs to Object ===
        tl.addLabel('dogRunToTarget', '>');
        const dogRunDuration = 1.5;
        tl.to(
            dogRef.current!,
            {
                x: fetchObjectLandX - 30,
                duration: dogRunDuration,
                ease: 'none',
            },
            'dogRunToTarget'
        )
            .to(
                backgroundRef.current!,
                {
                    x: () => {
                        const dogX = Number(
                            gsap.getProperty(dogRef.current!, 'x')
                        );
                        return `-=${(fetchObjectLandX - 30 - dogX) * 1.6}`;
                    },
                    duration: dogRunDuration,
                    ease: 'none',
                },
                'dogRunToTarget'
            )
            .addPause('dogAtObjectPause');

        // === Segment 3: Catch and Return ===
        tl.addLabel('catchAndReturnStart'); // No ">", allow jump here
        // Dog Decelerates and Prepares for Catch
        tl.add(() => {
            if (dogGallopSubTlRef.current)
                dogGallopSubTlRef.current.timeScale(0.5).duration(0.3);
        }) // Slow down gallop
            .to(
                dogRef.current!,
                { x: `+=${10}`, duration: 0.3, ease: 'power1.out' },
                '<'
            ) // Final short approach
            .add(() => {
                if (dogGallopSubTlRef.current)
                    dogGallopSubTlRef.current.pause();
            }, '+=0.2')
            .to(dogRef.current!, {
                y: dogGroundY,
                duration: 0.2,
                ease: 'power1.in',
            })
            .to(
                dogBodyRef.current!,
                {
                    scaleY: 0.9,
                    scaleX: 1.05,
                    skewY: 1,
                    duration: 0.2,
                    ease: 'power1.in',
                },
                '<'
            ); // Brace for catch

        // The Catch
        tl.to(dogHeadRef.current!, {
            rotation: 40,
            y: '+=22',
            x: '+=8',
            duration: 0.25,
            ease: 'power2.in',
        })
            .to(
                dogTailRef.current!,
                { rotation: -10, duration: 0.15, ease: 'power1.in' },
                '<'
            )
            .to(
                fetchObjectWorldRef.current!,
                {
                    y: '+=5',
                    x: '-=3',
                    opacity: 0,
                    duration: 0.1,
                    ease: 'sine.in',
                },
                '>-0.1'
            ) // Stick gets "nudged" into mouth
            .set(objectInMouthRef.current!, { opacity: 1 }, '>-0.05')
            .to(dogHeadRef.current!, {
                rotation: -8,
                y: 0,
                x: 0,
                duration: 0.45,
                ease: 'back.out(2.5)',
            }) // Head up proudly
            .to(
                dogBodyRef.current!,
                {
                    scaleY: 1.05,
                    scaleX: 0.95,
                    skewY: 0,
                    duration: 0.3,
                    ease: 'back.out(1)',
                },
                '<'
            ) // Body puffs up slightly
            .to(
                dogTailRef.current!,
                {
                    rotation: 30,
                    yoyo: true,
                    repeat: 3,
                    duration: 0.15,
                    ease: 'sine.inOut',
                },
                '>-0.2'
            ); // Happy short wags

        // Turn around
        tl.addLabel('dogTurn', '>+0.4')
            .to(
                dogRef.current!,
                { y: dogGroundY - 10, duration: 0.2, ease: 'sine.out' },
                'dogTurn'
            )
            .to(
                dogRef.current!,
                { rotationY: '+=180', duration: 0.4, ease: 'power1.inOut' },
                '>'
            ) // Use rotationY for a smoother turn if visual style supports it
            .to(
                dogRef.current!,
                { y: dogGroundY, duration: 0.2, ease: 'sine.in' },
                '>'
            );

        // Trot back
        tl.addLabel('dogTrotBack', '>+0.2')
            .add(() => {
                if (dogTrotSubTlRef.current)
                    dogTrotSubTlRef.current.timeScale(1).play(0);
            })
            .to(
                dogRef.current!,
                { x: dogStartX + 25, duration: 2.3, ease: 'none' },
                'dogTrotBack'
            )
            .to(
                backgroundRef.current!,
                { x: 0, duration: 2.3, ease: 'none' },
                'dogTrotBack'
            );

        tl.addLabel('finishReturn', '>')
            .add(() => {
                if (dogTrotSubTlRef.current) dogTrotSubTlRef.current.pause();
            })
            .to(dogRef.current!, {
                y: dogGroundY,
                duration: 0.2,
                ease: 'power1.in',
            })
            .to(dogHeadRef.current!, {
                rotation: -12,
                y: '-=3.5',
                duration: 0.3,
                ease: 'sine.out',
            })
            .to(
                dogTailRef.current!,
                {
                    rotation: 35,
                    duration: 0.15,
                    yoyo: true,
                    repeat: 9,
                    ease: 'sine.inOut',
                },
                '<'
            ); // Lots of wags

        tl.add(() => {
            setAnimationPhase(AnimationPhase.IDLE);
            setTimeout(() => {
                setHasFetchedObject(false);
                setInitialCuesDone(false);
                setProgress(0);
                setAnimationPhase(AnimationPhase.LOADING);
            }, 3000);
        }, '>+1.5');

        // --- REACT STATE DRIVEN CONTROL ---
        if (animationPhase === AnimationPhase.LOADING) {
            if (!initialCuesDone) {
                tl.play('sceneStart');
            } else {
                // Cues are done
                if (hasFetchedObject) {
                    // If API is done AND timeline is paused at or after dogAtObjectPause
                    if (
                        tl.paused() &&
                        tl.totalTime() >= (tl.labels as any).dogAtObjectPause
                    ) {
                        tl.seek('catchAndReturnStart').play(); // Jump to catch sequence
                        setAnimationPhase(AnimationPhase.FETCHED);
                    } else if (
                        !tl.isActive() &&
                        tl.totalTime() < (tl.labels as any).dogAtObjectPause
                    ) {
                        // If not active but should be running towards object
                        tl.play('dogRunToTarget');
                    }
                } else {
                    // API not done yet, continue or resume run to object
                    if (
                        tl.paused() &&
                        tl.totalTime() < (tl.labels as any).dogAtObjectPause
                    ) {
                        tl.play(); // Resume if paused before dogAtObjectPause
                    } else if (
                        !tl.isActive() &&
                        tl.totalTime() < (tl.labels as any).dogAtObjectPause
                    ) {
                        tl.play('dogRunToTarget'); // Ensure it plays up to the pause
                    }
                    // If it's already paused at dogAtObjectPause, do nothing, wait for hasFetchedObject
                }
            }
        }

        return () => {
            /* ... cleanup ... */
            if (masterTimelineRef.current) masterTimelineRef.current.kill();
            if (dogGallopSubTlRef.current) dogGallopSubTlRef.current.kill();
            if (dogTrotSubTlRef.current) dogTrotSubTlRef.current.kill();
        };
    }, [animationPhase, hasFetchedObject, initialCuesDone]);

    return (
        /* ... JSX ... */
        <Card className="w-full h-full flex flex-col items-center justify-center border-0 shadow-none bg-transparent">
            <CardContent className="flex flex-col items-center gap-6 p-6 w-full">
                <div
                    ref={animationContainerRef}
                    className="animation-container w-full h-72 relative rounded-xl overflow-hidden"
                >
                    <div className="background-elements" ref={backgroundRef}>
                        <div className="sky"></div>
                        <div className="grass"></div>
                        <div className="tree tree-1">
                            <div className="trunk"></div>
                            <div className="leaves"></div>
                        </div>
                        <div className="tree tree-2">
                            <div className="trunk"></div>
                            <div className="leaves"></div>
                        </div>
                    </div>

                    <div className="handler" ref={handlerRef}>
                        <div className="handler-torso" ref={handlerTorsoRef}>
                            <div
                                className="handler-body"
                                ref={handlerBodyRef}
                            ></div>
                            <div
                                className="handler-head"
                                ref={handlerHeadRef}
                            ></div>
                        </div>
                        <div
                            className="handler-leg left"
                            ref={handlerLegLeftRef}
                        ></div>{' '}
                        {/* Added ref */}
                        <div
                            className="handler-leg right"
                            ref={handlerLegRightRef}
                        ></div>{' '}
                        {/* Added ref */}
                        <div className="handler-arm" ref={handlerArmRef}>
                            <div className="handler-hand">
                                <div
                                    className="fetch-object-in-hand"
                                    ref={fetchObjectInHandRef}
                                >
                                    <div className="stick-part"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dog" ref={dogRef}>
                        <div className="dog-body" ref={dogBodyRef}></div>
                        <div className="dog-head" ref={dogHeadRef}>
                            <div
                                className="dog-ear left"
                                ref={dogEarLeftRef}
                            ></div>
                            <div
                                className="dog-ear right"
                                ref={dogEarRightRef}
                            ></div>
                            <div className="dog-snout"></div>
                            <div className="dog-eye left"></div>
                            <div className="dog-eye right"></div>
                            <div
                                className="object-in-mouth"
                                ref={objectInMouthRef}
                            >
                                <div className="stick-part"></div>
                            </div>
                        </div>
                        <div className="dog-leg fl" ref={dogLegFLRef}></div>
                        <div className="dog-leg fr" ref={dogLegFRRef}></div>
                        <div className="dog-leg bl" ref={dogLegBLRef}></div>
                        <div className="dog-leg br" ref={dogLegBRRef}></div>
                        <div className="dog-tail" ref={dogTailRef}></div>
                    </div>
                    <div
                        className="fetch-object-world"
                        ref={fetchObjectWorldRef}
                    >
                        <div className="stick-part"></div>
                    </div>
                </div>
                <div className="space-y-2 text-center w-full">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {animationPhase === AnimationPhase.FETCHED
                            ? fetchedTexts[
                                  currentTextIndex % fetchedTexts.length
                              ]
                            : loadingTexts[
                                  currentTextIndex % loadingTexts.length
                              ]}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {animationPhase === AnimationPhase.FETCHED
                            ? 'All done!'
                            : initialCuesDone
                            ? 'Fetching...'
                            : 'Getting ready...'}
                    </p>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mt-4">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-150 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </CardContent>

            <style jsx>{
                /* ... CSS ... (add styles for handler-leg if not already distinct) ... */ `
                    .animation-container {
                        background-color: #87ceeb;
                        position: relative;
                    }
                    .background-elements {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 200%;
                        height: 100%;
                    }
                    .sky {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 65%;
                        background: #aaddff;
                    }
                    .grass {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        height: 35%;
                        background: #77dd77;
                    }
                    .tree {
                        position: absolute;
                        bottom: 33%;
                        width: 60px;
                        height: 90px;
                        z-index: 1;
                    }
                    .tree .trunk {
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 10px;
                        height: 40px;
                        background: #8b4513;
                        border-radius: 2px;
                    }
                    .tree .leaves {
                        position: absolute;
                        top: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60px;
                        height: 60px;
                        background: #228b22;
                        border-radius: 50%;
                    }
                    .tree-1 {
                        left: 30%;
                        transform: scale(0.8);
                        opacity: 0.9;
                    }
                    .tree-2 {
                        left: 80%;
                        transform: scale(1.1);
                    }
                    .handler {
                        position: absolute;
                        bottom: 30%;
                        width: 40px;
                        height: 90px;
                        z-index: 9;
                        transform-origin: bottom center;
                    }
                    .handler-torso {
                        position: absolute;
                        bottom: 25px;
                        left: 50%;
                        width: 15px;
                        height: 60px;
                        transform: translateX(-50%);
                        transform-origin: bottom center;
                    }
                    .handler-body {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 40px;
                        background: #4682b4;
                        border-radius: 5px;
                    }
                    .handler-head {
                        position: absolute;
                        top: -15px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 20px;
                        height: 20px;
                        background: #ffe4c4;
                        border-radius: 50%;
                        transform-origin: center bottom;
                    }
                    .handler-leg {
                        position: absolute;
                        bottom: 0;
                        width: 8px;
                        height: 28px;
                        background: #2f4f4f;
                        border-radius: 3px;
                        transform-origin: top center;
                    }
                    .handler-leg.left {
                        left: 8px;
                    } /* Ensure these selectors target the right elements */
                    .handler-leg.right {
                        right: 8px;
                    } /* Ensure these selectors target the right elements */
                    .handler-arm {
                        position: absolute;
                        top: 5px;
                        left: calc(50% + 5px);
                        width: 8px;
                        height: 35px;
                        background: #4682b4;
                        border-radius: 4px;
                        transform-origin: top left;
                    }
                    .handler-hand {
                        position: absolute;
                        bottom: -5px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 10px;
                        height: 10px;
                        background: #ffe4c4;
                        border-radius: 50%;
                    }
                    .fetch-object-in-hand {
                        position: absolute;
                        top: -10px;
                        left: -5px;
                        width: 30px;
                        height: 8px;
                    }
                    .fetch-object-in-hand .stick-part,
                    .fetch-object-world .stick-part,
                    .object-in-mouth .stick-part {
                        width: 100%;
                        height: 100%;
                        background: #8b4513;
                        border-radius: 3px;
                        box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.1);
                    }
                    .fetch-object-world {
                        position: absolute;
                        width: 30px;
                        height: 8px;
                        z-index: 5;
                        opacity: 0;
                    }
                    .dog {
                        position: absolute;
                        bottom: 30%;
                        width: 80px;
                        height: 50px;
                        transform-origin: bottom center;
                        z-index: 10;
                    }
                    .dog-body {
                        position: absolute;
                        bottom: 10px;
                        left: 15px;
                        width: 50px;
                        height: 25px;
                        background: #deb887;
                        border-radius: 15px 15px 10px 10px;
                        transform-origin: center center;
                    }
                    .dog-head {
                        position: absolute;
                        bottom: 20px;
                        left: 50px;
                        width: 30px;
                        height: 30px;
                        background: #deb887;
                        border-radius: 50% 50% 40% 40%;
                        transform-origin: 10px 25px;
                    }
                    .dog-snout {
                        position: absolute;
                        bottom: 2px;
                        left: -8px;
                        width: 20px;
                        height: 15px;
                        background: #f5deb3;
                        border-radius: 8px;
                    }
                    .dog-eye {
                        position: absolute;
                        top: 8px;
                        width: 5px;
                        height: 5px;
                        background: #333;
                        border-radius: 50%;
                    }
                    .dog-eye.left {
                        left: 5px;
                    }
                    .dog-eye.right {
                        right: 5px;
                    }
                    .dog-ear {
                        position: absolute;
                        top: -5px;
                        width: 12px;
                        height: 18px;
                        background: #a0522d;
                        border-radius: 40% 40% 50% 50%;
                    }
                    .dog-ear.left {
                        left: 2px;
                        transform-origin: 100% 100%;
                    }
                    .dog-ear.right {
                        right: 2px;
                        transform-origin: 0% 100%;
                    }
                    .dog-leg {
                        position: absolute;
                        bottom: 0px;
                        width: 8px;
                        height: 20px;
                        background: #deb887;
                        border-radius: 4px;
                        transform-origin: top center;
                    }
                    .dog-leg.fl {
                        left: 18px;
                    }
                    .dog-leg.fr {
                        left: 32px;
                    }
                    .dog-leg.bl {
                        left: 50px;
                    }
                    .dog-leg.br {
                        left: 62px;
                    }
                    .dog-tail {
                        position: absolute;
                        bottom: 20px;
                        left: 5px;
                        width: 25px;
                        height: 8px;
                        background: #a0522d;
                        border-radius: 4px;
                        transform-origin: left center;
                    }
                    .object-in-mouth {
                        position: absolute;
                        bottom: 0px;
                        left: -20px;
                        transform: rotate(-15deg);
                        width: 30px;
                        height: 8px;
                        opacity: 0;
                    }
                `
            }</style>
        </Card>
    );
};
