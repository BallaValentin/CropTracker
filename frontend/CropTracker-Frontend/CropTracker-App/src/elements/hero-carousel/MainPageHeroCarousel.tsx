import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import slide1 from "../../assets/main-page-slides/slide1.png";
import slide2 from "../../assets/main-page-slides/slide2.png";
import slide3 from "../../assets/main-page-slides/slide3.png";
import slide4 from "../../assets/main-page-slides/slide4.png";
import slide5 from "../../assets/main-page-slides/slide5.png";
import slide6 from "../../assets/main-page-slides/slide6.png";
import { useTranslation } from "react-i18next";

function MainPageHeroCarousel() {
  const { t } = useTranslation();

  const slidesData = [
    {
      id: 1,
      image: slide1,
      text: t("elements.heroCarousels.mainPageHeroCarousel.slide1Text", {
        defaultValue:
          "Create and edit crop fields with real-time map coordinates.",
      }),
    },
    {
      id: 2,
      image: slide2,
      text: t("elements.heroCarousels.mainPageHeroCarousel.slide2Text", {
        defaultValue:
          "Divide fields into parcels by crop type and configure custom row layouts.",
      }),
    },
    {
      id: 3,
      image: slide3,
      text: t("elements.heroCarousels.mainPageHeroCarousel.slide3Text", {
        defaultValue:
          "Log completed activities or schedule future field tasks.",
      }),
    },
    {
      id: 4,
      image: slide4,
      text: t("elements.heroCarousels.mainPageHeroCarousel.slide4Text", {
        defaultValue:
          "Use built-in activity types or create your own custom workflows.",
      }),
    },
    {
      id: 5,
      image: slide5,
      text: t("elements.heroCarousels.mainPageHeroCarousel.slide5Text", {
        defaultValue: "Review and monitor your complete field history.",
      }),
    },
    {
      id: 6,
      image: slide6,
      text: t("elements.heroCarousels.mainPageHeroCarousel.slide6Text", {
        defaultValue:
          "Gain insights with automatically generated work performance analytics.",
      }),
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 30000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "99%",
        maxWidth: "80%",
        mx: "auto",
        overflow: "hidden",
        borderRadius: 3,
      }}
    >
      <Box ref={emblaRef} sx={{ overflow: "hidden", width: "100%" }}>
        <Box sx={{ display: "flex" }}>
          {slidesData.map((slide) => (
            <Box
              key={slide.id}
              sx={{ flex: "0 0 100%", position: "relative", height: 650 }}
            >
              <Box
                component={"img"}
                src={slide.image}
                alt={slide.text}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: 35,
                  left: 0,
                  width: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.65)",
                  py: 2,
                  px: 3,
                  boxSizing: "border-box",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#ffffff", fontWeight: 500 }}
                >
                  {slide.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          zIndex: 10,
        }}
      >
        {scrollSnaps.map((_, index) => (
          <Box
            key={index}
            component="button"
            onClick={() => scrollTo(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "none",
              padding: 0,
              cursor: "pointer",
              bgcolor:
                index === selectedIndex
                  ? "#ffffff"
                  : "rgba(255, 255, 255, 0.4)",
              transform: index === selectedIndex ? "scale(1.25)" : "scale(1)",
              transition: "all 0.2s ease",
              "&:focus": { outline: "none" },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default MainPageHeroCarousel;
