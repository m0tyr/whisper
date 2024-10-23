import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import { motion } from "framer-motion";
import { useState } from "react";

interface GifPluginProps {
  width: number;
  searchValue: string;
}

const GifPlugin: React.FC<GifPluginProps> = ({ width, searchValue }) => {
  const gf = new GiphyFetch("Guuxn8us0YtO7vOOeiKBl9Q2hWdY3140");


  const fetchGifs = (offset: number) => {
    if (searchValue.trim() === "") {
      return gf.trending({ offset, limit: 10 });
    }
    return gf.search(searchValue, { offset, limit: 10 });
  };
  return (
    <Grid
      width={width - 10}
      columns={3}
      gutter={6}
      fetchGifs={fetchGifs}
      key={searchValue}
    />
  );
};

export default GifPlugin;
