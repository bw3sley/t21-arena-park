import { Font } from "@react-pdf/renderer";

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-black-webfont.ttf",
            fontWeight: "heavy",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-blackitalic-webfont.ttf",
            fontWeight: "heavy",
            fontStyle: "italic",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bold-webfont.ttf",
            fontWeight: "bold",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bolditalic-webfont.ttf",
            fontWeight: "bold",
            fontStyle: "italic",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-thin-webfont.ttf",
            fontWeight: "thin",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-thinitalic-webfont.ttf",
            fontWeight: "thin",
            fontStyle: "italic",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf",
            fontWeight: "normal",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-italic-webfont.ttf",
            fontWeight: "normal",
            fontStyle: "italic",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-medium-webfont.ttf",
            fontWeight: "medium",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-mediumitalic-webfont.ttf",
            fontWeight: "medium",
            fontStyle: "italic",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-light-webfont.ttf",
            fontWeight: "light",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-lightitalic-webfont.ttf",
            fontWeight: "light",
            fontStyle: "italic",
        },
    ],
});