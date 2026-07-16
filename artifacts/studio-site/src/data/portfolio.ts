export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  img: string;
}

export const portfolio: PortfolioItem[] = [
  {
    id: 1,
    title: "Letrero Corporativo Clínica Las Condes",
    category: "Señalética Corporativa",
    img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1784233797/DSC02109_uq3vzc.jpg",
  },
  {
    id: 2,
    title: "Stand Universidad San Sebastián",
    category: "Producción Industrial",
    img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1784234019/5CE2DB07-CF96-485F-900E-A69064DF7C66_l5ogjc.jpg",
  },
  {
    id: 3,
    title: "Módulo Museo Historia Nacional",
    category: "Producción Industrial",
    img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1784235188/ChatGPT_Image_16_jul_2026_16_52_55_aoxikm.png",
  },
  {
    id: 4,
    title: "Impresiones Gráficas Cenefas",
    category: "Producción Gráfica",
    img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1784235365/5c5a292a-3412-4c8f-8a63-7892d53409a8.png",
  },
];
