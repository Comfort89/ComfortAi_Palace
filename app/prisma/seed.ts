import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.productCollection.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();

  const dresses = await prisma.category.create({
    data: { name: "Dresses", slug: "dresses", description: "Casual, dinner, evening and African-inspired dresses." }
  });
  const sets = await prisma.category.create({
    data: { name: "Two-Piece Sets", slug: "two-piece", description: "Luxury and casual two-piece sets." }
  });
  const occasion = await prisma.category.create({
    data: { name: "Occasion Wear", slug: "occasion-wear", description: "Statement pieces for special moments." }
  });

  const dinnerEdit = await prisma.collection.create({
    data: { name: "The Dinner Edit", slug: "dinner-edit", description: "Evening elegance." }
  });
  const weekendEdit = await prisma.collection.create({
    data: { name: "The Weekend Edit", slug: "weekend-edit", description: "Comfortable luxury." }
  });

  const amara = await prisma.product.create({
    data: {
      name: "The Amara Dress",
      slug: "amara-dress",
      description: "Elegance made effortless. Flowing silhouette with premium finish.",
      fabric: "Premium crepe",
      fit: "True to size",
      care: "Dry clean recommended",
      deliveryEstimate: "2-4 working days (Lagos)",
      priceNaira: 85000,
      isNew: true,
      trending: true,
      categoryId: dresses.id,
      images: { create: [{ url: "/uploads/amara-1.jpg", alt: "Amara full view", position: 0 }] },
      variants: {
        create: [
          { size: "S", colour: "Black", stock: 5 },
          { size: "M", colour: "Wine", stock: 3 },
          { size: "L", colour: "Emerald", stock: 4 }
        ]
      }
    }
  });

  const zuri = await prisma.product.create({
    data: {
      name: "Zuri Luxury Set",
      slug: "zuri-luxury-set",
      description: "Two-piece comfort set with a premium feel.",
      fabric: "Soft stretch",
      fit: "Comfort fit",
      care: "Machine wash cold",
      deliveryEstimate: "2-4 working days (Lagos)",
      priceNaira: 72500,
      trending: true,
      categoryId: sets.id,
      images: { create: [{ url: "/uploads/zuri-1.jpg", alt: "Zuri set", position: 0 }] },
      variants: {
        create: [
          { size: "S", colour: "Gold", stock: 2 },
          { size: "M", colour: "Cream", stock: 3 }
        ]
      }
    }
  });

  const adaeze = await prisma.product.create({
    data: {
      name: "Adaeze Dinner Gown",
      slug: "adaeze-dinner-gown",
      description: "Statement occasion gown. Limited piece.",
      fabric: "Satin blend",
      fit: "True to size",
      care: "Dry clean only",
      deliveryEstimate: "3-5 working days (Nigeria)",
      priceNaira: 98000,
      isBestSeller: true,
      categoryId: occasion.id,
      images: { create: [{ url: "/uploads/adaeze-1.jpg", alt: "Adaeze gown", position: 0 }] },
      variants: {
        create: [
          { size: "XS", colour: "Wine", stock: 2 },
          { size: "S", colour: "Black", stock: 3 }
        ]
      }
    }
  });

  await prisma.productCollection.createMany({
    data: [
      { productId: amara.id, collectionId: dinnerEdit.id },
      { productId: adaeze.id, collectionId: dinnerEdit.id },
      { productId: zuri.id, collectionId: weekendEdit.id }
    ]
  });

  console.log("Seeded 3 products, 3 categories, 2 collections.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
