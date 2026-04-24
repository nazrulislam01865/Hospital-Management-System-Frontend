"use client";

import { useEffect } from "react";

type TitleProps = {
  page: string;
};

export default function Title({ page }: TitleProps): null {
  useEffect(() => {
    document.title = `Hospital Management System | ${page}`;
  }, [page]);

  return null;
}