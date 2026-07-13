export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  img: string;
}

export const portfolio: PortfolioItem[] = [
  {
    id: 1,
    title: "Producción Gráfica",
    category: "Impresión Gran Formato",
    img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842078/produccion.png_na2rtr.png",
  },
  {
    id: 2,
    title: "Producción Industrial",
    category: "Stands y Exhibición",
    img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842077/stand.png_bh1u4z.png",
  },
  {
    id: 3,
    title: "Montaje en Obra",
    category: "Instalación Señalética",
    img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842077/instalacion-panel.png_lvioxm.png",
  },
  {
    id: 4,
    title: "Stand USS",
    category: "Diseño Integral",
    img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842496/stand-uss.png_cpwfms.jpg",
  },
];
