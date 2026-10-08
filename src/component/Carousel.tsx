import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { A11y, Autoplay, Keyboard } from 'swiper/modules';
import { tv } from 'tailwind-variants';
// Swiper's core layout (slide track and transforms); all visual styling below is Tailwind.
import 'swiper/css';
import '../css/tw-global.css';

type CarouselSlide = {
    image: string;
    alt: string;
    href?: string;
};

const focusStyle = 'focus-visible:outline-2 focus-visible:outline-offset-2';

const carousel = tv({
    slots: {
        root: 'flex w-full gap-3',
        stage: 'relative aspect-video w-full min-w-0 flex-1',
        swiper: 'size-full rounded-lg',
        slide: 'relative overflow-hidden rounded-lg',
        slideLink: 'block size-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-anu-primary-800',
        slideImage: 'size-full object-cover',
        slideShade: 'pointer-events-none absolute inset-0 bg-linear-to-b from-black/30 to-transparent to-30%',
        autoplayButton: `absolute bottom-5 left-5 z-10 cursor-pointer rounded-full text-anu-primary-700 transition-transform duration-200 hover:scale-110 ${focusStyle} focus-visible:outline-white motion-reduce:transition-none`,
        controls: '',
        arrows: '',
        arrow: `cursor-pointer ${focusStyle} focus-visible:outline-anu-primary-800 disabled:cursor-default`,
        arrowLabel: 'underline underline-offset-4',
        indicator: 'flex gap-2',
        dot: `cursor-pointer rounded-1000 transition-all duration-300 ${focusStyle} focus-visible:outline-anu-primary-800`,
        chevron: 'shrink-0',
    },
    variants: {
        // 'bottom' puts the indicator and Previous/Next links under the slides,
        // 'side' puts round up/down buttons and a vertical indicator beside them.
        controls: {
            bottom: {
                root: 'flex-col',
                controls: 'flex items-center justify-between gap-6',
                arrows: 'flex items-center gap-6 text-base font-semibold',
                arrow: 'flex items-center gap-2 text-anu-primary-1000 disabled:text-anu-grey-600',
                indicator: 'items-center',
            },
            side: {
                root: 'flex-row',
                controls: 'flex w-8 shrink-0 flex-col items-center justify-between',
                arrows: 'flex flex-col gap-5',
                arrow: 'flex size-8 items-center justify-center rounded-full border border-anu-primary-800 text-anu-primary-800 disabled:border-anu-grey-500 disabled:bg-anu-grey-100 disabled:text-anu-grey-600',
                indicator: 'flex-col items-center',
            },
        },
        isActive: {
            true: { dot: 'bg-anu-primary-700' },
            false: { dot: 'size-2.5 bg-anu-grey-200' },
        },
        direction: {
            right: '',
            down: { chevron: 'rotate-90' },
            left: { chevron: 'rotate-180' },
            up: { chevron: '-rotate-90' },
        },
    },
    compoundVariants: [
        // The active dot stretches along the indicator's axis.
        { controls: 'bottom', isActive: true, class: { dot: 'h-2.5 w-7.5' } },
        { controls: 'side', isActive: true, class: { dot: 'h-7.5 w-2.5' } },
    ],
    defaultVariants: {
        controls: 'bottom',
    },
});

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

type CarouselStyles = ReturnType<typeof carousel>;

const get_chevron = (styles: CarouselStyles, direction: 'left' | 'right' | 'up' | 'down') => (
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
        className={styles.chevron({ direction })}
    >
        <path d="M0.54 0.54L6.97 7.36L0.54 14.19" />
    </svg>
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

const get_slideContent = (styles: CarouselStyles, slide: CarouselSlide) => {
    const image = <img src={slide.image} alt={slide.alt} className={styles.slideImage()} />;
    return (
        <>
            {slide.href ? (
                <a href={slide.href} className={styles.slideLink()}>
                    {image}
                </a>
            ) : (
                image
            )}
            <div className={styles.slideShade()} />
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
    const styles = carousel({ controls });
    const isSide = controls === 'side';
    const isFirst = activeIndex === 0;
    const isLast = activeIndex === slides.length - 1;

    const indicator = (
        <div className={styles.indicator()}>
            {slides.map((slide, index) => (
                <button
                    key={index}
                    type="button"
                    aria-label={`Go to slide ${index + 1}: ${slide.alt}`}
                    aria-current={index === activeIndex}
                    onClick={() => swiper?.slideTo(index)}
                    className={styles.dot({ isActive: index === activeIndex })}
                />
            ))}
        </div>
    );

    return (
        <section aria-roledescription="carousel" aria-label={label} className={styles.root()}>
            <div className={styles.stage()}>
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
                    className={styles.swiper()}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index} className={styles.slide()}>
                            {get_slideContent(styles, slide)}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {showAutoplayButton && slides.length > 1 && (
                    <button
                        type="button"
                        aria-label={isAutoplaying ? 'Pause automatic slide show' : 'Play automatic slide show'}
                        onClick={() => (isAutoplaying ? swiper?.autoplay.stop() : swiper?.autoplay.start())}
                        className={styles.autoplayButton()}
                    >
                        {get_autoplayIcon(isAutoplaying)}
                    </button>
                )}
            </div>

            {isSide ? (
                <div className={styles.controls()}>
                    <div className={styles.arrows()}>
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
                                className={styles.arrow()}
                            >
                                {get_chevron(styles, button.direction)}
                            </button>
                        ))}
                    </div>
                    {indicator}
                </div>
            ) : (
                <div className={styles.controls()}>
                    {indicator}
                    <div className={styles.arrows()}>
                        <button type="button" disabled={isFirst} onClick={() => swiper?.slidePrev()} className={styles.arrow()}>
                            {get_chevron(styles, 'left')}
                            <span className={styles.arrowLabel()}>Previous</span>
                        </button>
                        <button type="button" disabled={isLast} onClick={() => swiper?.slideNext()} className={styles.arrow()}>
                            <span className={styles.arrowLabel()}>Next</span>
                            {get_chevron(styles, 'right')}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
