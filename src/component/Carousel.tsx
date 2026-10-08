import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { A11y, Autoplay, Keyboard } from 'swiper/modules';
// Swiper's core layout (slide track and transforms); all visual styling below is Tailwind.
import { cva } from 'class-variance-authority';
import 'swiper/css';
import '../css/tw-global.css';

type CarouselSlide = {
    image: string;
    alt: string;
    href?: string;
};

type CarouselProps = {
    slides: CarouselSlide[];
    // Describes the carousel for screen readers.
    label: string;
    // 'bottom' puts the indicator and Previous/Next links under the slides,
    // 'side' puts round up/down buttons and a vertical indicator beside them.
    controls?: 'bottom' | 'side';
    // Whether the slides start advancing on their own. The play/pause button toggles it.
    autoplay?: boolean;
    // Milliseconds each slide stays before autoplay moves on.
    autoplayDelay?: number;
    // Shows the play/pause button over the slides.
    showAutoplayButton?: boolean;
};

const chevron = cva('shrink-0', {
    variants: {
        direction: {
            right: '',
            down: 'rotate-90',
            left: 'rotate-180',
            up: '-rotate-90',
        },
    },
});

const get_chevron = (direction: 'left' | 'right' | 'up' | 'down') => (
    <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="15"
        viewBox="0 0 7.51 14.73"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.08"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={chevron({ direction })}
    >
        <path d="M0.54 0.54L6.97 7.36L0.54 14.19" />
    </svg>
);

const carousel = cva('flex w-full gap-3', {
    variants: {
        controls: {
            bottom: 'flex-col',
            side: 'flex-row',
        },
    },
});

const carouselIndicator = cva('flex gap-2', {
    variants: {
        controls: {
            bottom: 'items-center',
            side: 'flex-col items-center',
        },
    },
});

// The active dot stretches along the direction the slides travel.
const carouselDot = cva(
    'cursor-pointer rounded-1000 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-anu-primary-800',
    {
        variants: {
            controls: {
                bottom: '',
                side: '',
            },
            isActive: {
                true: 'bg-anu-primary-700',
                false: 'size-2.5 bg-anu-grey-200',
            },
        },
        compoundVariants: [
            { controls: 'bottom', isActive: true, className: 'h-2.5 w-7.5' },
            { controls: 'side', isActive: true, className: 'h-7.5 w-2.5' },
        ],
    }
);

const carouselStepButton = cva(
    'flex cursor-pointer items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-anu-primary-800 disabled:cursor-default disabled:text-anu-grey-600',
    {
        variants: {
            controls: {
                // Text links under the slides.
                bottom: 'gap-2 text-anu-primary-1000',
                // Round icon buttons beside the slides.
                side: 'size-8 justify-center rounded-full border border-anu-primary-800 text-anu-primary-800 disabled:border-anu-grey-500 disabled:bg-anu-grey-100',
            },
        },
    }
);

const get_autoplayIcon = (isRunning: boolean) => (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill="currentColor" />
        {isRunning ? (
            <path d="M17 14H21.5V34H17V14ZM26.5 14H31V34H26.5V14Z" fill="white" />
        ) : (
            <path d="M36.36 24.24L18.18 34.74V13.75L36.36 24.24Z" fill="white" />
        )}
    </svg>
);

const get_slideContent = (slide: CarouselSlide) => {
    const image = <img src={slide.image} alt={slide.alt} className="size-full object-cover" />;
    return (
        <>
            {slide.href ? (
                <a href={slide.href} className="block size-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-anu-primary-800">
                    {image}
                </a>
            ) : (
                image
            )}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/30 to-transparent to-30%" />
        </>
    );
};

export const Carousel: React.FC<CarouselProps> = ({
    slides,
    label,
    controls = 'bottom',
    autoplay = false,
    autoplayDelay = 5000,
    showAutoplayButton = true,
}) => {
    const [swiper, setSwiper] = useState<SwiperClass | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoplaying, setIsAutoplaying] = useState(autoplay);
    const isSide = controls === 'side';
    const isFirst = activeIndex === 0;
    const isLast = activeIndex === slides.length - 1;

    const indicator = (
        <div className={carouselIndicator({ controls })}>
            {slides.map((slide, index) => (
                <button
                    key={index}
                    type="button"
                    aria-label={`Go to slide ${index + 1}: ${slide.alt}`}
                    aria-current={index === activeIndex}
                    onClick={() => swiper?.slideTo(index)}
                    className={carouselDot({ controls, isActive: index === activeIndex })}
                />
            ))}
        </div>
    );

    return (
        <section aria-roledescription="carousel" aria-label={label} className={carousel({ controls })}>
            <div className="relative aspect-video w-full min-w-0 flex-1">
                <Swiper
                    modules={[A11y, Autoplay, Keyboard]}
                    direction={isSide ? 'vertical' : 'horizontal'}
                    keyboard={{ enabled: true }}
                    // Manual navigation keeps autoplay running; only the button stops it.
                    autoplay={{ enabled: autoplay, delay: autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    spaceBetween={16}
                    onSwiper={setSwiper}
                    onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
                    onAutoplayStart={() => setIsAutoplaying(true)}
                    onAutoplayStop={() => setIsAutoplaying(false)}
                    className="size-full rounded-lg"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index} className="relative overflow-hidden rounded-lg">
                            {get_slideContent(slide)}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {showAutoplayButton && slides.length > 1 && (
                    <button
                        type="button"
                        aria-label={isAutoplaying ? 'Pause automatic slide show' : 'Play automatic slide show'}
                        onClick={() => (isAutoplaying ? swiper?.autoplay.stop() : swiper?.autoplay.start())}
                        className="absolute bottom-5 left-5 z-10 cursor-pointer rounded-full text-anu-primary-700 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                    >
                        {get_autoplayIcon(isAutoplaying)}
                    </button>
                )}
            </div>

            {isSide ? (
                <div className="flex w-8 shrink-0 flex-col items-center justify-between">
                    <div className="flex flex-col gap-5">
                        {[
                            { label: 'Previous slide', direction: 'up' as const, disabled: isFirst, onClick: () => swiper?.slidePrev() },
                            { label: 'Next slide', direction: 'down' as const, disabled: isLast, onClick: () => swiper?.slideNext() },
                        ].map((button) => (
                            <button
                                key={button.label}
                                type="button"
                                aria-label={button.label}
                                disabled={button.disabled}
                                onClick={button.onClick}
                                className={carouselStepButton({ controls })}
                            >
                                {get_chevron(button.direction)}
                            </button>
                        ))}
                    </div>
                    {indicator}
                </div>
            ) : (
                <div className="flex items-center justify-between gap-6">
                    {indicator}
                    <div className="flex items-center gap-6 text-base font-semibold">
                        <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => swiper?.slidePrev()}
                            className={carouselStepButton({ controls })}
                        >
                            {get_chevron('left')}
                            <span className="underline underline-offset-4">Previous</span>
                        </button>
                        <button
                            type="button"
                            disabled={isLast}
                            onClick={() => swiper?.slideNext()}
                            className={carouselStepButton({ controls })}
                        >
                            <span className="underline underline-offset-4">Next</span>
                            {get_chevron('right')}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
