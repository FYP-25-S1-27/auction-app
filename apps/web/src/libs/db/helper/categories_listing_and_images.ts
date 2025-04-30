import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { listings, listingImages, listingCategory } from "../schema";

faker.seed(321);

const categories = {
  ALCOHOL: ["WINE", "WHISKEY", "BEER"],
  ART: ["PAINTINGS", "SCULPTURES", "PHOTOGRAPHY"],
  BOOKS: ["FICTION", "NON-FICTION", "COMICS"],
  CARS: ["SEDANS", "SUVS", "TRUCKS"],
  CLOTHING: ["MEN'S", "WOMEN'S", "CHILDREN'S"],
  FURNITURE: ["LIVING ROOM", "BEDROOM", "OFFICE"],
  GADGETS: ["SMARTPHONES", "LAPTOPS", "TABLETS"],
  JEWELRY: ["RINGS", "NECKLACES", "BRACELETS"],
  SPORTS: ["FOOTBALL", "BASKETBALL", "TENNIS"],
  TOYS: ["ACTION FIGURES", "DOLLS", "PUZZLES"],
  WATCHES: ["LUXURY", "SMARTWATCHES", "CASUAL"],
};

export async function seedCategoriesListingsAndImages(
  userId: string[]
): Promise<{ listingIds: number[] }> {
  let listingIds: number[] = [];
  // insert categories
  for (const [parent, subcats] of Object.entries(categories)) {
    await db.insert(listingCategory).values({
      name: parent.toUpperCase(),
      parent: null,
    });
    for (const subcat of subcats) {
      await db.insert(listingCategory).values({
        name: subcat.toUpperCase(),
        parent: parent.toUpperCase(),
      });
      let listingName = "";
      let imagePath = "";
      for (let i = 0; i < 3; i++) {
        switch (subcat.toUpperCase()) {
          // ALCOHOL
          case "WINE":
          case "WHISKEY":
          case "BEER":
            listingName = `Alcoholic Beverage ${faker.number.int({
              min: 1930,
              max: 1999,
            })}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/alcohol/whisky_1.jpg",
              "/images/rand/alcohol/whisky_2.jpg",
              "/images/rand/alcohol/whisky_3.jpg",
              "/images/rand/alcohol/beer_1.jpg",
              "/images/rand/alcohol/beer_2.jpg",
              "/images/rand/alcohol/beer_3.jpg",
              "/images/rand/alcohol/wine_1.jpg",
              "/images/rand/alcohol/wine_2.jpg",
              "/images/rand/alcohol/wine_3.jpg",
            ]);
            break;
          // ART
          case "PAINTINGS":
          case "SCULPTURES":
          case "PHOTOGRAPHY":
            listingName = `Art Piece ${faker.number.int({
              min: 1930,
              max: 1999,
            })}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/art/painting_1.jpg",
              "/images/rand/art/painting_2.jpg",
              "/images/rand/art/painting_3.jpg",
              "/images/rand/art/sculptures_1.jpg",
              "/images/rand/art/sculptures_2.jpg",
              "/images/rand/art/sculptures_3.jpg",
              "/images/rand/art/photography_1.jpg",
              "/images/rand/art/photography_2.jpg",
              "/images/rand/art/photography_3.jpg",
            ]);
            break;
          // BOOKS
          case "FICTION":
          case "NON-FICTION":
          case "COMICS":
            listingName = `Book - ${faker.book.author()} - ${faker.number.int({
              min: 1930,
              max: 1999,
            })}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/books/fiction_1.jpg",
              "/images/rand/books/fiction_2.jpg",
              "/images/rand/books/fiction_3.jpeg",
              "/images/rand/books/nonfiction_1.jpg",
              "/images/rand/books/nonfiction_2.png",
              "/images/rand/books/nonfiction_3.jpeg",
              "/images/rand/books/comics_1.jpg",
              "/images/rand/books/comics_2.jpg",
              "/images/rand/books/comics_3.jpg",
            ]);
            break;
          // CARS
          case "SEDANS":
          case "SUVS":
          case "TRUCKS":
            listingName = `${faker.vehicle.manufacturer()} ${faker.vehicle.model()} ${faker.number.int(
              {
                min: 1930,
                max: 1999,
              }
            )}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/cars/sedan_1.jpg",
              "/images/rand/cars/sedan_2.jpg",
              "/images/rand/cars/sedan_3.jpg",
              "/images/rand/cars/suv_1.jpg",
              "/images/rand/cars/suv_2.jpg",
              "/images/rand/cars/suv_3.jpg",
              "/images/rand/cars/truck_1.jpg",
              "/images/rand/cars/truck_2.jpg",
              "/images/rand/cars/truck_3.jpg",
            ]);
            break;
          // CLOTHING
          case "MEN'S":
          case "WOMEN'S":
          case "CHILDREN'S":
            listingName = `Clothing Item ${faker.helpers.arrayElement([
              "S",
              "M",
              "L",
            ])}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/clothing/men_1.jpg",
              "/images/rand/clothing/men_2.jpg",
              "/images/rand/clothing/men_3.jpg",
              "/images/rand/clothing/women_1.jpg",
              "/images/rand/clothing/women_2.jpg",
              "/images/rand/clothing/women_3.jpg",
              "/images/rand/clothing/children_1.jpg",
              "/images/rand/clothing/children_2.jpg",
              "/images/rand/clothing/children_3.jpg",
            ]);
            break;
          // FURNITURE
          case "LIVING ROOM":
          case "BEDROOM":
          case "OFFICE":
            listingName = `${faker.helpers.arrayElement([
              "Sofa",
              "Chair",
              "Table",
              "Desk",
            ])}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/furniture/living_1.jpg",
              "/images/rand/furniture/living_2.jpg",
              "/images/rand/furniture/living_3.jpg",
              "/images/rand/furniture/bedroom_1.jpg",
              "/images/rand/furniture/bedroom_2.jpg",
              "/images/rand/furniture/bedroom_3.jpeg",
              "/images/rand/furniture/office_1.png",
              "/images/rand/furniture/office_2.jpg",
              "/images/rand/furniture/office_3.jpg",
            ]);
            break;
          // GADGETS
          case "SMARTPHONES":
          case "LAPTOPS":
          case "TABLETS":
            listingName = `${faker.helpers.arrayElement([
              "Samsung",
              "Apple",
              "Lenovo",
            ])} ${faker.number.int({ min: 2010, max: 2023 })}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/gadgets/smartphone_1.png",
              "/images/rand/gadgets/smartphone_2.jpeg",
              "/images/rand/gadgets/smartphone_3.png",
              "/images/rand/gadgets/laptop_1.jpg",
              "/images/rand/gadgets/laptop_2.jpg",
              "/images/rand/gadgets/laptop_3.jpg",
              "/images/rand/gadgets/tablet_1.jpg",
              "/images/rand/gadgets/tablet_2.jpg",
              "/images/rand/gadgets/tablet_3.jpg",
            ]);
            break;
          // JEWELRY
          case "RINGS":
          case "NECKLACES":
          case "BRACELETS":
            listingName = `Jewelry ${faker.string.alpha({ casing: "upper" })}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/jewelry/rings_1.jpg",
              "/images/rand/jewelry/rings_2.jpg",
              "/images/rand/jewelry/rings_3.jpg",
              "/images/rand/jewelry/necklace_1.jpg",
              "/images/rand/jewelry/necklace_2.jpg",
              "/images/rand/jewelry/necklace_3.jpg",
              "/images/rand/jewelry/bracelets_1.jpg",
              "/images/rand/jewelry/bracelets_2.jpg",
              "/images/rand/jewelry/bracelets_3.jpg",
            ]);
            break;
          // SPORTS
          case "FOOTBALL":
          case "BASKETBALL":
          case "TENNIS":
            listingName = `Sports Equipment ${faker.string.alpha({
              casing: "upper",
            })}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/sports/soccer_1.jpg",
              "/images/rand/sports/soccer_2.jpg",
              "/images/rand/sports/soccer_3.jpg",
              "/images/rand/sports/basketball_1.jpg",
              "/images/rand/sports/basketball_2.jpg",
              "/images/rand/sports/basketball_3.jpg",
              "/images/rand/sports/tennis_1.jpg",
              "/images/rand/sports/tennis_2.jpg",
              "/images/rand/sports/tennis_3.jpg",
            ]);
            break;
          // TOYS
          case "ACTION FIGURES":
          case "DOLLS":
          case "PUZZLES":
            listingName = `Toy ${faker.string.alpha({ casing: "upper" })}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/toys/action_1.jpg",
              "/images/rand/toys/action_2.jpg",
              "/images/rand/toys/action_3.jpg",
              "/images/rand/toys/dolls_1.jpg",
              "/images/rand/toys/dolls_2.jpg",
              "/images/rand/toys/dolls_3.jpg",
              "/images/rand/toys/puzzle_1.jpg",
              "/images/rand/toys/puzzle_2.jpg",
              "/images/rand/toys/puzzle_3.jpg",
            ]);
            break;
          // WATCHES
          case "LUXURY":
          case "SMARTWATCHES":
          case "CASUAL":
            listingName = `Watch ${faker.string.alpha({ casing: "upper" })}`;
            imagePath = faker.helpers.arrayElement([
              "/images/rand/watches/watch_1.jpg",
              "/images/rand/watches/watch_2.jpg",
              "/images/rand/watches/watch_3.jpg",
              "/images/rand/watches/smartwatch_1.jpg",
              "/images/rand/watches/smartwatch_2.jpg",
              "/images/rand/watches/smartwatch_3.jpg",
              "/images/rand/watches/casual_1.jpg",
              "/images/rand/watches/casual_2.jpg",
              "/images/rand/watches/casual_3.jpg",
            ]);
            break;
          // Default case for any other subcategories
          default:
            break;
        }

        // Insert listing
        const _startPrice = faker.number.int({ min: 10, max: 1000 });
        const listingId = await db
          .insert(listings)
          .values({
            // @ts-expect-error - was throwing error that userUuid is not a valid property, but it is
            userUuid: faker.helpers.arrayElement(userId),
            category: subcat.toUpperCase(),
            name: listingName,
            startingPrice: _startPrice,
            currentPrice: faker.number.int({ min: _startPrice, max: 9999 }),
            endTime: faker.date.anytime(),
            description: faker.lorem.paragraph(),
            createdAt: faker.date.past({ years: 1 }),
            status: faker.helpers.arrayElement(["ACTIVE", "SOLD"]),
          })
          .returning({ id: listings.id });

        // insert listing images
        await db.insert(listingImages).values({
          listingId: listingId[0].id,
          imageUrl: imagePath,
        });
      }
    }
  }

  // Get all listing IDs
  const allListings = await db.select().from(listings);
  listingIds = allListings.map((listing) => listing.id);
  return { listingIds };
}
