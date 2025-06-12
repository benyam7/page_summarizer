'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { gsap } from 'gsap';

const AnimationPhase = {
    LOADING: 'LOADING',
    FETCHED: 'FETCHED',
    IDLE: 'IDLE',
};

export const StickFigureAnimation = () => {
    const [progress, setProgress] = useState(0);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const loadingTexts = [
        'Getting the park ready...',
        'Dog senses a disturbance in the data...',
        'Handler is warming up...',
        'Stick acquired! Preparing for launch!',
        'Fetching, please wait...',
    ];
    const fetchedTexts = [
        'Data fetched successfully!',
        "Good dog, that's the one!",
        'Return to sender (with data)!',
    ];
    const [animationPhase, setAnimationPhase] = useState(
        AnimationPhase.LOADING
    );
    const [hasFetchedObject, setHasFetchedObject] = useState(false);
    const [initialCuesDone, setInitialCuesDone] = useState(false);

    const animationContainerRef = useRef(null);
    const dogRef = useRef(null);
    const dogHeadRef = useRef(null);
    const dogBodyRef = useRef(null);
    const dogEarLeftRef = useRef(null);
    const dogEarRightRef = useRef(null);
    const dogLegFLRef = useRef(null);
    const dogLegFRRef = useRef(null);
    const dogLegBLRef = useRef(null);
    const dogLegBRRef = useRef(null);
    const dogTailRef = useRef(null);
    const handlerRef = useRef(null);
    const handlerArmRef = useRef(null);
    const handlerBodyRef = useRef(null);
    const handlerHeadRef = useRef(null);
    const handlerTorsoRef = useRef(null);
    const handlerLegLeftRef = useRef(null);
    const handlerLegRightRef = useRef(null);
    const fetchObjectWorldRef = useRef(null);
    const fetchObjectInHandRef = useRef(null);
    const objectInMouthRef = useRef(null);
    const backgroundRef = useRef(null);

    const masterTimelineRef = useRef(null);
    const dogGallopSubTlRef = useRef(null);
    const dogTrotSubTlRef = useRef(null);

    useEffect(() => {
        if (
            initialCuesDone &&
            animationPhase === AnimationPhase.LOADING &&
            !hasFetchedObject
        ) {
            const apiCallDuration = Math.random() * 2500 + 5000; // 5-7.5 seconds
            const timer = setTimeout(() => {
                setHasFetchedObject(true);
            }, apiCallDuration);
            return () => clearTimeout(timer);
        }
    }, [initialCuesDone, animationPhase, hasFetchedObject]);

    useEffect(() => {
        let progressIntervalId;
        let textIntervalId;
        if (animationPhase === AnimationPhase.LOADING) {
            progressIntervalId = setInterval(() => {
                setProgress((prev) =>
                    prev >= 95 && !hasFetchedObject && initialCuesDone
                        ? 95
                        : prev >= 100
                        ? 100
                        : prev + 1
                );
            }, 120);
            textIntervalId = setInterval(() => {
                setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
            }, 1800);
        } else if (animationPhase === AnimationPhase.FETCHED) {
            setProgress(100);
            setCurrentTextIndex(0);
        }
        return () => {
            clearInterval(progressIntervalId);
            clearInterval(textIntervalId);
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

        if (masterTimelineRef.current) masterTimelineRef.current.kill();
        if (dogGallopSubTlRef.current) dogGallopSubTlRef.current.kill();
        if (dogTrotSubTlRef.current) dogTrotSubTlRef.current.kill();
        gsap.set(
            [
                /* ... all animated refs ... */
            ],
            { clearProps: 'all' }
        );

        const containerWidth = animationContainerRef.current.offsetWidth;
        const dogStartX = containerWidth * 0.3;
        const handlerStartX = containerWidth * 0.1;
        const fetchObjectLandX = containerWidth * 0.9;
        const groundOffset = 2; // Sink elements slightly into grass
        const dogGroundY = groundOffset;
        const handlerGroundY = groundOffset;
        const objectHeight = 8; // From CSS
        const objectGroundY =
            parseFloat(getComputedStyle(animationContainerRef.current).height) *
                0.65 -
            objectHeight +
            groundOffset; // 35% grass height

        masterTimelineRef.current = gsap.timeline({ paused: true });
        const tl = masterTimelineRef.current;

        // === Dog Gallop Cycle (More detailed body motion) ===
        const createDogGallopCycle = () => {
            const gallopTl = gsap.timeline({ repeat: -1, paused: true });
            const cycleDuration = 0.4; // Faster, more energetic gallop
            const bodyYLower = dogGroundY + 3; // Max dip
            const bodyYUpperSuspension = dogGroundY - 10; // Max air

            // Body overall vertical motion, stretch, and squash
            gallopTl
                .to(
                    dogRef.current,
                    {
                        y: bodyYUpperSuspension,
                        duration: cycleDuration * 0.15,
                        ease: 'sine.out',
                    },
                    'sus1_start'
                ) // Up - extended suspension
                .to(
                    dogBodyRef.current,
                    {
                        scaleY: 1.1,
                        scaleX: 0.9,
                        skewY: -4,
                        duration: cycleDuration * 0.15,
                        ease: 'sine.out',
                    },
                    '<'
                ) // Stretch
                .to(
                    dogRef.current,
                    {
                        y: bodyYLower,
                        duration: cycleDuration * 0.25,
                        ease: 'sine.in',
                    },
                    '>'
                ) // Down - front leg contact
                .to(
                    dogBodyRef.current,
                    {
                        scaleY: 0.9,
                        scaleX: 1.1,
                        skewY: 3,
                        duration: cycleDuration * 0.25,
                        ease: 'sine.in',
                    },
                    '<'
                ) // Squash/gather
                .to(
                    dogRef.current,
                    {
                        y: bodyYUpperSuspension * 0.8,
                        duration: cycleDuration * 0.2,
                        ease: 'sine.out',
                    },
                    '>'
                ) // Up - gathered suspension
                .to(
                    dogBodyRef.current,
                    {
                        scaleY: 1.05,
                        scaleX: 0.95,
                        skewY: -2,
                        duration: cycleDuration * 0.2,
                        ease: 'sine.out',
                    },
                    '<'
                ) // Slight stretch
                .to(
                    dogRef.current,
                    {
                        y: bodyYLower,
                        duration: cycleDuration * 0.2,
                        ease: 'sine.in',
                    },
                    '>'
                ) // Down - hind leg contact
                .to(
                    dogBodyRef.current,
                    {
                        scaleY: 0.95,
                        scaleX: 1.05,
                        skewY: 2,
                        duration: cycleDuration * 0.2,
                        ease: 'sine.in',
                    },
                    '<'
                ); // Squash for push-off

            // Head - more connected to body but slightly independent
            gallopTl.to(
                dogHeadRef.current,
                {
                    rotation: 3,
                    y: '-=1',
                    duration: cycleDuration / 4,
                    yoyo: true,
                    repeat: 3,
                    ease: 'sine.inOut',
                },
                0
            );

            // Ears - reacting to movement
            gallopTl.to(
                [dogEarLeftRef.current, dogEarRightRef.current],
                {
                    rotation: (i) => (i === 0 ? 25 : -25),
                    y: '-=1',
                    duration: cycleDuration * 0.4,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: 1,
                },
                0
            );

            // Enhanced leg movements with proper timing
            // Back Right
            gallopTl.fromTo(
                dogLegBRRef.current,
                { rotation: -60, y: dogGroundY },
                {
                    keyframes: [
                        {
                            rotation: 70,
                            y: dogGroundY - 2,
                            ease: 'power1.out',
                            duration: cycleDuration * 0.3,
                        },
                        {
                            rotation: -60,
                            y: dogGroundY,
                            ease: 'power1.in',
                            duration: cycleDuration * 0.7,
                        },
                    ],
                },
                0
            );

            // Back Left (slight offset)
            gallopTl.fromTo(
                dogLegBLRef.current,
                { rotation: -60, y: dogGroundY },
                {
                    keyframes: [
                        {
                            rotation: 70,
                            y: dogGroundY - 2,
                            ease: 'power1.out',
                            duration: cycleDuration * 0.3,
                        },
                        {
                            rotation: -60,
                            y: dogGroundY,
                            ease: 'power1.in',
                            duration: cycleDuration * 0.7,
                        },
                    ],
                },
                cycleDuration * 0.08
            );

            // Front Right (after a delay for suspension)
            gallopTl.fromTo(
                dogLegFRRef.current,
                { rotation: -65, y: dogGroundY },
                {
                    keyframes: [
                        {
                            rotation: 75,
                            y: dogGroundY - 2,
                            ease: 'power1.out',
                            duration: cycleDuration * 0.3,
                        },
                        {
                            rotation: -65,
                            y: dogGroundY,
                            ease: 'power1.in',
                            duration: cycleDuration * 0.7,
                        },
                    ],
                },
                cycleDuration * 0.22
            );

            // Front Left (slight offset)
            gallopTl.fromTo(
                dogLegFLRef.current,
                { rotation: -65, y: dogGroundY },
                {
                    keyframes: [
                        {
                            rotation: 75,
                            y: dogGroundY - 2,
                            ease: 'power1.out',
                            duration: cycleDuration * 0.3,
                        },
                        {
                            rotation: -65,
                            y: dogGroundY,
                            ease: 'power1.in',
                            duration: cycleDuration * 0.7,
                        },
                    ],
                },
                cycleDuration * 0.3
            );

            gallopTl.to(
                dogTailRef.current,
                {
                    rotation: 5,
                    skewY: 3,
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

        const createDogTrotCycle = () => {
            /* ... (same as previous fix, review durations/eases if needed) ... */
            const trotTl = gsap.timeline({ repeat: -1, paused: true });
            const cycleDuration = 0.38;
            trotTl.to(
                dogRef.current,
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
                dogBodyRef.current,
                {
                    rotation: 0.5,
                    y: '+=0.5',
                    duration: cycleDuration / 2,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: 1,
                },
                0
            ); // Slight body rock
            trotTl.to(
                dogHeadRef.current,
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
                    [dogLegFRRef.current, dogLegBLRef.current],
                    {
                        rotation: 40,
                        duration: cycleDuration / 2,
                        ease: 'power1.out',
                    },
                    0
                )
                .to(
                    [dogLegFRRef.current, dogLegBLRef.current],
                    {
                        rotation: -25,
                        duration: cycleDuration / 2,
                        ease: 'power1.in',
                    },
                    '>'
                );
            trotTl
                .to(
                    [dogLegFLRef.current, dogLegBRRef.current],
                    {
                        rotation: 40,
                        duration: cycleDuration / 2,
                        ease: 'power1.out',
                    },
                    cycleDuration / 2
                )
                .to(
                    [dogLegFLRef.current, dogLegBRRef.current],
                    {
                        rotation: -25,
                        duration: cycleDuration / 2,
                        ease: 'power1.in',
                    },
                    '>'
                );
            trotTl.to(
                dogTailRef.current,
                {
                    rotation: 40,
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
        tl.set(dogRef.current, {
            x: dogStartX,
            y: dogGroundY,
            scaleX: 1,
            rotationY: 0,
        })
            .set(handlerRef.current, {
                x: handlerStartX,
                y: handlerGroundY,
                scaleX: 1,
                rotationY: 0,
            })
            .set(handlerTorsoRef.current, { rotation: 0, skewX: 0, y: 0 })
            .set(handlerArmRef.current, { rotation: 10, y: 0, x: 0 })
            .set(fetchObjectInHandRef.current, { opacity: 1, y: 0, x: 0 })
            .set(fetchObjectWorldRef.current, {
                opacity: 0,
                x: handlerStartX + 30,
                y: 50 + handlerGroundY,
            })
            .set(objectInMouthRef.current, { opacity: 0 })
            .set(backgroundRef.current, { x: 0 });

        tl.to(
            dogTailRef.current,
            {
                rotation: 30,
                duration: 0.12,
                yoyo: true,
                repeat: 9,
                ease: 'sine.inOut',
            },
            'sceneStart'
        ) // More excited wags
            .to(
                dogHeadRef.current,
                { rotation: -20, y: '-=3', duration: 0.4, ease: 'sine.out' },
                'sceneStart'
            )
            .to(
                [dogEarLeftRef.current, dogEarRightRef.current],
                {
                    rotation: (i) => (i === 0 ? -40 : 40),
                    y: '-=1',
                    duration: 0.25,
                    ease: 'sine.out',
                },
                'sceneStart'
            );

        // === Segment 1: Handler Cues & Throw ===
        tl.addLabel('handlerCuesStart', '>-0.2');
        tl.to(
            handlerHeadRef.current,
            { rotation: 25, duration: 0.4, ease: 'sine.inOut' },
            'handlerCuesStart+=0.2'
        )
            .to(
                handlerTorsoRef.current,
                { rotation: 10, skewX: -5, duration: 0.5, ease: 'power1.out' },
                'handlerCuesStart+=0.2'
            )
            .to(
                handlerArmRef.current,
                {
                    rotation: -55,
                    x: '+=10',
                    y: '+=2',
                    duration: 0.6,
                    ease: 'back.out(1.5)',
                },
                'handlerCuesStart+=0.3'
            )
            .to(
                dogHeadRef.current,
                { rotation: -25, y: '+=3', duration: 0.4, ease: 'sine.inOut' },
                'handlerCuesStart+=0.5'
            );

        tl.addLabel('pointing', '>+0.4')
            .to(
                handlerHeadRef.current,
                { rotation: -15, duration: 0.5, ease: 'sine.inOut' },
                'pointing'
            )
            .to(
                handlerTorsoRef.current,
                {
                    rotation: -15,
                    skewX: 8,
                    duration: 0.6,
                    ease: 'power1.inOut',
                },
                'pointing'
            )
            .to(
                handlerArmRef.current,
                {
                    rotation: 40,
                    x: '-=6',
                    y: '-=10',
                    duration: 0.5,
                    ease: 'power2.out',
                },
                'pointing+=0.1'
            )
            .to(
                dogHeadRef.current,
                { rotation: 15, y: '-=2', duration: 0.4, ease: 'sine.inOut' },
                'pointing+=0.3'
            );

        // Wind up: More pronounced body mechanics and weight shift
        tl.addLabel('windup', '>+0.3')
            .to(
                handlerLegLeftRef.current,
                {
                    rotation: -8,
                    y: '+=2',
                    scaleY: 0.95,
                    duration: 0.5,
                    ease: 'power2.in',
                },
                'windup'
            ) // Back leg bends more
            .to(
                handlerLegRightRef.current,
                {
                    rotation: 12,
                    y: '-=1',
                    scaleY: 1.02,
                    duration: 0.5,
                    ease: 'power2.in',
                },
                'windup'
            ) // Front leg straightens, heel might lift
            .to(
                handlerTorsoRef.current,
                {
                    rotation: -35,
                    skewX: 20,
                    y: '-=5',
                    duration: 0.5,
                    ease: 'power2.in',
                },
                'windup'
            )
            .to(
                handlerHeadRef.current,
                { rotation: 10, duration: 0.5, ease: 'power1.in' },
                'windup'
            )
            .to(
                handlerArmRef.current,
                {
                    rotation: -135,
                    y: '+=15',
                    x: '-=8',
                    duration: 0.5,
                    ease: 'power2.in',
                },
                'windup'
            );

        // Throw: Powerful release and follow through
        const throwReleaseTime = 'throwAction+=0.08';
        tl.addLabel('throwAction', '>')
            .to(
                handlerLegLeftRef.current,
                {
                    rotation: 5,
                    y: 0,
                    scaleY: 1,
                    duration: 0.35,
                    ease: 'expo.out',
                },
                'throwAction'
            ) // Explosive push from back leg
            .to(
                handlerLegRightRef.current,
                {
                    rotation: -5,
                    y: 0,
                    scaleY: 0.98,
                    duration: 0.35,
                    ease: 'expo.out',
                },
                'throwAction'
            ) // Front leg braces
            .to(
                handlerTorsoRef.current,
                {
                    rotation: 30,
                    skewX: -15,
                    y: 0,
                    duration: 0.35,
                    ease: 'expo.out',
                },
                'throwAction'
            )
            .to(
                handlerArmRef.current,
                {
                    rotation: 70,
                    y: '-=20',
                    x: '+=12',
                    duration: 0.35,
                    ease: 'expo.out',
                },
                'throwAction'
            ) // Fast arm swing
            .to(
                handlerHeadRef.current,
                { rotation: -20, duration: 0.35, ease: 'expo.out' },
                'throwAction'
            )
            .set(fetchObjectInHandRef.current, { opacity: 0 }, throwReleaseTime)
            .fromTo(
                fetchObjectWorldRef.current,
                {
                    // From: near hand at release
                    opacity: 1,
                    x: () =>
                        gsap.getProperty(handlerRef.current, 'x') +
                        25 +
                        Math.sin(
                            (gsap.getProperty(
                                handlerArmRef.current,
                                'rotation'
                            ) *
                                Math.PI) /
                                180
                        ) *
                            35,
                    y: () =>
                        gsap.getProperty(handlerRef.current, 'y') +
                        25 -
                        Math.cos(
                            (gsap.getProperty(
                                handlerArmRef.current,
                                'rotation'
                            ) *
                                Math.PI) /
                                180
                        ) *
                            35,
                    rotation: -60,
                },
                {
                    // To: landing spot with enhanced physics
                    duration: 1.0,
                    ease: 'power1.out',
                    motionPath: {
                        path: [
                            {
                                x: handlerStartX + containerWidth * 0.45,
                                y: handlerGroundY - 70,
                            },
                            { x: fetchObjectLandX, y: objectGroundY },
                        ],
                        curviness: 1.0,
                    },
                    rotation: '+=920', // More spin
                },
                throwReleaseTime
            )
            .to(
                handlerArmRef.current,
                { rotation: 90, y: '-=8', duration: 0.6, ease: 'circ.out' },
                'throwAction+=0.35'
            ) // Fuller follow through
            .to(
                handlerTorsoRef.current,
                { rotation: 20, skewX: 0, duration: 0.6, ease: 'circ.out' },
                'throwAction+=0.35'
            )
            .to(handlerLegLeftRef.current, { rotation: 0 }, '>-0.3') // Settle legs
            .to(handlerLegRightRef.current, { rotation: 0 }, '<');

        // Dog's launch: more explosive and timed with throw
        tl.to(
            dogRef.current,
            {
                keyframes: [
                    {
                        y: dogGroundY - 15,
                        x: `+=${containerWidth * 0.03}`,
                        ease: 'power2.out',
                        duration: 0.15,
                    }, // Up
                    {
                        y: dogGroundY,
                        x: `+=${containerWidth * 0.06}`,
                        ease: 'power1.in',
                        duration: 0.2,
                    }, // Land and forward
                ],
            },
            'throwAction+=0.03'
        )
            .to(
                dogBodyRef.current,
                {
                    keyframes: [
                        {
                            scaleY: 1.2,
                            scaleX: 0.8,
                            skewY: -3,
                            ease: 'power2.out',
                            duration: 0.15,
                        },
                        {
                            scaleY: 0.9,
                            scaleX: 1.1,
                            skewY: 2,
                            ease: 'power1.in',
                            duration: 0.2,
                        },
                    ],
                },
                '<'
            )
            .add(() => {
                if (dogGallopSubTlRef.current)
                    dogGallopSubTlRef.current.invalidate().play(0);
            }, 'throwAction+=0.35') // Start gallop after landing
            .add(() => setInitialCuesDone(true), '>');

        tl.addLabel('dogRunToTarget', '>');
        const dogRunDuration = 1.4; // Slightly faster run
        tl.to(
            dogRef.current,
            {
                x: fetchObjectLandX - 25,
                duration: dogRunDuration,
                ease: 'none',
            },
            'dogRunToTarget'
        )
            .to(
                backgroundRef.current,
                {
                    x: () =>
                        `-=${
                            (fetchObjectLandX -
                                25 -
                                gsap.getProperty(dogRef.current, 'x')) *
                            1.7
                        }`,
                    duration: dogRunDuration,
                    ease: 'none',
                },
                'dogRunToTarget'
            )
            .addPause('dogAtObjectPause');

        tl.addLabel('catchAndReturnStart');
        // Dog Decelerates, Prepares for Catch, and Catches
        tl.add(() => {
            if (dogGallopSubTlRef.current) {
                dogGallopSubTlRef.current.timeScale(0.4);
                gsap.to(dogGallopSubTlRef.current, {
                    duration: 0.2,
                    timeScale: 0,
                    onComplete: () => dogGallopSubTlRef.current?.pause(),
                });
            }
        }) // Smoothly slow down and pause gallop
            .to(
                dogRef.current,
                { x: `+=${15}`, duration: 0.4, ease: 'power1.out' },
                '<+=0.05'
            ) // Final approach, slight overshoot for realism
            .to(
                dogBodyRef.current,
                {
                    scaleY: 0.9,
                    scaleX: 1.05,
                    skewY: 1,
                    duration: 0.2,
                    ease: 'power1.in',
                },
                '>-0.1'
            )
            .to(dogHeadRef.current, {
                rotation: 45,
                y: '+=25',
                x: '+=10',
                duration: 0.2,
                ease: 'power2.in',
            }) // Quicker, more direct head dart
            .to(
                dogTailRef.current,
                { rotation: -15, duration: 0.1, ease: 'power1.in' },
                '<'
            )
            .to(
                fetchObjectWorldRef.current,
                { opacity: 0, scale: 0.8, duration: 0.05, ease: 'sine.in' },
                '>-0.08'
            ) // Stick "goes into" mouth
            .set(objectInMouthRef.current, { opacity: 1, scale: 0.8 }, '<')
            .to(
                objectInMouthRef.current,
                { scale: 1, duration: 0.1, ease: 'back.out(2)' },
                '>'
            )
            .to(dogHeadRef.current, {
                rotation: -10,
                y: 0,
                x: 0,
                duration: 0.4,
                ease: 'back.out(3)',
            }) // Stronger proud lift
            .to(
                dogBodyRef.current,
                {
                    scaleY: 1.1,
                    scaleX: 0.9,
                    skewY: -1,
                    duration: 0.35,
                    ease: 'back.out(1.5)',
                },
                '<'
            ) // Body "uncoils" with pride
            .to(
                dogTailRef.current,
                {
                    rotation: 35,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.12,
                    ease: 'sine.inOut',
                },
                '>-0.25'
            );

        // Turn around - simplified hop and flip
        tl.addLabel('dogTurn', '>+0.3')
            .to(
                dogRef.current,
                { y: dogGroundY - 12, duration: 0.15, ease: 'sine.out' },
                'dogTurn'
            )
            .to(dogRef.current, { scaleX: -1, duration: 0.01 }, '>+=0.05') // Flip
            .to(dogRef.current, { x: '-=5', duration: 0.1, ease: 'none' }, '<')
            .to(
                dogRef.current,
                { y: dogGroundY, duration: 0.15, ease: 'sine.in' },
                '>'
            );

        // Trot back with pride
        tl.addLabel('dogTrotBack', '>+0.2')
            .add(() => {
                if (dogTrotSubTlRef.current)
                    dogTrotSubTlRef.current.invalidate().play(0).timeScale(1);
            })
            .to(
                dogRef.current,
                { x: dogStartX + 30, duration: 2.4, ease: 'none' },
                'dogTrotBack'
            )
            .to(
                backgroundRef.current,
                { x: 0, duration: 2.4, ease: 'none' },
                'dogTrotBack'
            );

        // Final proud stance
        tl.addLabel('finishReturn', '>')
            .add(() => {
                if (dogTrotSubTlRef.current) dogTrotSubTlRef.current.pause();
            })
            .to(dogRef.current, {
                y: dogGroundY,
                duration: 0.2,
                ease: 'power1.in',
            })
            .to(dogHeadRef.current, {
                rotation: -15,
                y: '-=4',
                duration: 0.3,
                ease: 'sine.out',
            }) // Head up to handler
            .to(
                dogTailRef.current,
                {
                    rotation: 40,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 13,
                    ease: 'sine.inOut',
                },
                '<'
            );

        tl.add(() => {
            setAnimationPhase(AnimationPhase.IDLE);
            setTimeout(() => {
                setHasFetchedObject(false);
                setInitialCuesDone(false);
                setProgress(0);
                setAnimationPhase(AnimationPhase.LOADING); // This will trigger the useEffect to rebuild
            }, 3000);
        }, '>+1.5');

        // --- REACT STATE DRIVEN CONTROL ---
        if (animationPhase === AnimationPhase.LOADING) {
            if (!initialCuesDone) {
                tl.play('sceneStart');
            } else {
                if (hasFetchedObject) {
                    if (
                        tl.paused() &&
                        tl.totalTime() >= tl.labels.dogAtObjectPause
                    ) {
                        tl.seek('catchAndReturnStart').play();
                        setAnimationPhase(AnimationPhase.FETCHED);
                    } else if (
                        !tl.isActive() &&
                        tl.totalTime() < tl.labels.dogAtObjectPause
                    ) {
                        tl.play('dogRunToTarget');
                    }
                } else {
                    if (
                        tl.paused() &&
                        tl.totalTime() < tl.labels.dogAtObjectPause
                    ) {
                        tl.play();
                    } else if (
                        !tl.isActive() &&
                        tl.totalTime() < tl.labels.dogAtObjectPause
                    ) {
                        tl.play('dogRunToTarget');
                    }
                }
            }
        }

        return () => {
            if (masterTimelineRef.current) masterTimelineRef.current.kill();
            if (dogGallopSubTlRef.current) dogGallopSubTlRef.current.kill();
            if (dogTrotSubTlRef.current) dogTrotSubTlRef.current.kill();
        };
    }, [animationPhase, hasFetchedObject, initialCuesDone]); // Critical dependencies

    return (
        /* ... JSX ... ensure handler legs have refs (handlerLegLeftRef, handlerLegRightRef) ... */
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
                /* ... CSS ... (ensure handler-leg.left/right classes exist and have transform-origin: top center;) ... */ `
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
                        bottom: 28px; /* Adjusted for leg height */
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
                    } /* Crucial: transform-origin */
                    .handler-leg.left {
                        left: 8px;
                    }
                    .handler-leg.right {
                        right: 8px;
                    }
                    .handler-arm {
                        position: absolute;
                        top: 5px;
                        left: calc(50% + 5px);
                        width: 8px;
                        height: 35px;
                        background: #4682b4;
                        border-radius: 4px;
                        transform-origin: top left;
                    } /* Crucial: transform-origin */
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
                        bottom: 10px; /* Adjusted for legs */
                        left: 15px;
                        width: 50px;
                        height: 25px;
                        background: #deb887;
                        border-radius: 15px 15px 10px 10px;
                        transform-origin: center center;
                    }
                    .dog-head {
                        position: absolute;
                        bottom: 20px; /* On body */
                        left: 50px; /* Front of body */
                        width: 30px;
                        height: 30px;
                        background: #deb887;
                        border-radius: 50% 50% 40% 40%;
                        transform-origin: 10px 25px;
                    } /* neck pivot: x,y from top-left */
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
                    } /* base of ear, bottom-right corner */
                    .dog-ear.right {
                        right: 2px;
                        transform-origin: 0% 100%;
                    } /* base of ear, bottom-left corner */
                    .dog-leg {
                        position: absolute;
                        bottom: 0px; /* Base of dog */
                        width: 8px;
                        height: 20px;
                        background: #deb887;
                        border-radius: 4px;
                        transform-origin: top center;
                    } /* Crucial: transform-origin */
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
                        bottom: 20px; /* Base on body */
                        left: 5px; /* Back of body */
                        width: 25px;
                        height: 8px;
                        background: #a0522d;
                        border-radius: 4px;
                        transform-origin: left center;
                    } /* Crucial: transform-origin */
                    .object-in-mouth {
                        position: absolute;
                        bottom: 0px; /* In snout */
                        left: -20px; /* Extends from snout */
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
