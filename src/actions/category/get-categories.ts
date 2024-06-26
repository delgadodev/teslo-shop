"use server";

import prisma from "@/lib/prisma";
import { ok } from "assert";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (e) {
    return [];
  }
};
