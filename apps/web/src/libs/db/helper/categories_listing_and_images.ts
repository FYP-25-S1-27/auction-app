import { en, Faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { listings, listingImages, listingCategory } from "../schema";
import { addDays, subDays } from "date-fns";

const faker = new Faker({ locale: [en] }); // new instance of faker to override seed
faker.seed(907845632);

export const CATEGORIES = {
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

export async function seedCategoriesListingsAndImages(userId: string[]) {
  // insert categories
  for (const [parent, subcats] of Object.entries(CATEGORIES)) {
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
      let _startPrice = 0;
      for (let i = 0; i < 3; i++) {
        switch (subcat.toUpperCase()) {
          // ALCOHOL
          case "WINE":
          case "WHISKEY":
          case "BEER":
            _startPrice = faker.number.int({ min: 10, max: 1000 });
            if (subcat === "WINE") {
              listingName = `Wine ${faker.number.int({
                min: 1930,
                max: 1999,
              })}`;
              const _names = [
                "Bedoba Saperavi 1995",
                "Demuerte 1990",
                "Muga Rioja 1999",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/alcohol/wine_${i + 1}.jpg`;
            }
            if (subcat === "WHISKEY") {
              const _names = [
                "Jack Daniel's 1999",
                "W.Premiers 1995",
                "Ballantine's 1990",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/alcohol/whisky_${i + 1}.jpg`;
            }
            if (subcat === "BEER") {
              _startPrice = faker.number.int({ min: 10, max: 100 });
              const _names = ["Cass Fresh", "Terra", "Hite"];
              listingName = _names[i];
              imagePath = `/images/rand/alcohol/beer_${i + 1}.jpg`;
            }
            break;
          // ART
          case "PAINTINGS":
          case "SCULPTURES":
          case "PHOTOGRAPHY":
            _startPrice = faker.number.int({ min: 1000, max: 3000 });
            if (subcat === "PAINTINGS") {
              listingName = `Painting ${faker.number.int({
                min: 1930,
                max: 1999,
              })}`;
              imagePath = `/images/rand/art/painting_${i + 1}.jpg`;
            }
            if (subcat === "SCULPTURES") {
              listingName = `Sculpture ${faker.number.int({
                min: 1930,
                max: 1999,
              })}`;
              imagePath = `/images/rand/art/sculptures_${i + 1}.jpg`;
            }
            if (subcat === "PHOTOGRAPHY") {
              _startPrice = faker.number.int({ min: 200, max: 1500 });
              listingName = `Photography ${faker.number.int({
                min: 1930,
                max: 1999,
              })}`;
              imagePath = `/images/rand/art/photography_${i + 1}.jpg`;
            }
            break;
          // BOOKS
          case "FICTION":
          case "NON-FICTION":
          case "COMICS":
            _startPrice = faker.number.int({ min: 10, max: 100 });
            if (subcat === "FICTION") {
              const _names = [
                "What Does It Feel Like - Sophie Kinsella",
                "Harry Potter and the half-blood prince - J.K. Rowling",
                "To The Bright Edge of the World - Eowyn Ivey",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/books/fiction_${i + 1}.jpg`;
            }
            if (subcat === "NON-FICTION") {
              const _names = [
                "The Non-Fiction Book - Stephanie Chandler & Karl W. Palachuk",
                "Atomic Habits - James Clear",
                "Life After Power - Jared Cohen",
              ];
              listingName = _names[i];
              const _images = [
                "/images/rand/books/nonfiction_1.jpg",
                "/images/rand/books/nonfiction_2.png",
                "/images/rand/books/nonfiction_3.jpg",
              ];
              imagePath = _images[i];
            }
            if (subcat === "COMICS") {
              const _names = [
                "Superman - Roy Thomas",
                "Dragon Ball Super vol 15",
                "Naruto vol 71 - Masashi Kishimoto",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/books/comics_${i + 1}.jpg`;
            }
            break;
          // CARS
          case "SEDANS":
          case "SUVS":
          case "TRUCKS":
            _startPrice = faker.number.int({ min: 5000, max: 30000 });
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
            _startPrice = faker.number.int({ min: 10, max: 100 });
            if (subcat === "MEN'S") {
              const _names = ["Men's Shirt", "Men's Pants", "Men's Jacket"];
              listingName = _names[i];
              imagePath = `/images/rand/clothing/men_${i + 1}.jpg`;
            }
            if (subcat === "WOMEN'S") {
              const _names = [
                "Women's Blouse",
                "Women's Dress",
                "Women's Skirt",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/clothing/women_${i + 1}.jpg`;
            }
            if (subcat === "CHILDREN'S") {
              const _names = [
                "Children's Hoodie",
                "Children's T-Shirt",
                "Children's Dress",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/clothing/children_${i + 1}.jpg`;
            }
            break;
          // FURNITURE
          case "LIVING ROOM":
          case "BEDROOM":
          case "OFFICE":
            _startPrice = faker.number.int({ min: 10, max: 800 });
            if (subcat === "LIVING ROOM") {
              const _names = ["Table", "Chair", "Cofee Table"];
              listingName = _names[i];
              imagePath = `/images/rand/furniture/living_${i + 1}.jpg`;
            }
            if (subcat === "BEDROOM") {
              const _names = ["Nightstand", "Bed", "Dressing Table"];
              listingName = _names[i];
              imagePath = `/images/rand/furniture/bedroom_${i + 1}.jpg`;
            }
            if (subcat === "OFFICE") {
              const _names = ["Desk", "Office Chair", "Drawer"];
              listingName = _names[i];
              const _images = [
                "/images/rand/furniture/office_1.png",
                "/images/rand/furniture/office_2.jpg",
                "/images/rand/furniture/office_3.jpg",
              ];
              imagePath = _images[i];
            }
            break;
          // GADGETS
          case "SMARTPHONES":
          case "LAPTOPS":
          case "TABLETS":
            _startPrice = faker.number.int({ min: 100, max: 1200 });
            if (subcat === "SMARTPHONES") {
              const _names = ["Oppo", "Apple iPhone", "Samsung Galaxy"];
              listingName = _names[i];
              const _images = [
                "/images/rand/gadgets/smartphone_1.png",
                "/images/rand/gadgets/smartphone_2.jpg",
                "/images/rand/gadgets/smartphone_3.png",
              ];
              imagePath = _images[i];
            }
            if (subcat === "LAPTOPS") {
              const _names = ["Lenovo", "Asus", "Microsoft Surface"];
              listingName = _names[i];
              imagePath = `/images/rand/gadgets/laptop_${i + 1}.jpg`;
            }
            if (subcat === "TABLETS") {
              const _names = ["Android", "Apple iPad", "Samsung Galaxy Tab"];
              listingName = _names[i];
              imagePath = `/images/rand/gadgets/tablet_${i + 1}.jpg`;
            }
            break;
          // JEWELRY
          case "RINGS":
          case "NECKLACES":
          case "BRACELETS":
            _startPrice = faker.number.int({ min: 1000, max: 3000 });
            if (subcat === "RINGS") {
              const _names = [
                "Glamira Gold Diamond Ring",
                "Rose Gold Diamond Ring",
                "Gold Ring",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/jewelry/rings_${i + 1}.jpg`;
            }
            if (subcat === "NECKLACES") {
              const _names = [
                "Charles & Keith Annalise Clover Rose Gold Necklace",
                "Time and Tru Gold Necklace",
                "Infinity and Heart Rose Gold Silver Necklace",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/jewelry/necklace_${i + 1}.jpg`;
            }
            if (subcat === "BRACELETS") {
              const _names = [
                "Cartier Rose Gold Bracelet",
                "Pandora Moments Silver Bracelet",
                "Swarovski Imber Gold Bracelet",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/jewelry/bracelets_${i + 1}.jpg`;
            }
            break;
          // SPORTS
          case "FOOTBALL":
          case "BASKETBALL":
          case "TENNIS":
            _startPrice = faker.number.int({ min: 50, max: 200 });
            if (subcat === "FOOTBALL") {
              const _names = [
                "Soccer Cleats",
                "Keeper Gloves",
                "Messi Golden Ball Trophy",
              ];
              listingName = _names[i];
              if (i === 2) {
                _startPrice = faker.number.int({ min: 1000, max: 3000 });
              }
              imagePath = `/images/rand/sports/soccer_${i + 1}.jpg`;
            }
            if (subcat === "BASKETBALL") {
              const _names = [
                "Wilson Basketball",
                "Basketball Backboard",
                "Basketball Shoes",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/sports/basketball_${i + 1}.jpg`;
            }
            if (subcat === "TENNIS") {
              const _names = [
                "Artengo Racket",
                "Vermont Tennis Balls",
                "Roger Federer Signed Racket",
              ];
              listingName = _names[i];
              if (i === 2) {
                _startPrice = faker.number.int({ min: 1000, max: 3000 });
              }
              imagePath = `/images/rand/sports/tennis_${i + 1}.jpg`;
            }
            break;
          // TOYS
          case "ACTION FIGURES":
          case "DOLLS":
          case "PUZZLES":
            _startPrice = faker.number.int({ min: 10, max: 1000 });
            if (subcat === "ACTION FIGURES") {
              const _names = [
                "Batman Action Figure",
                "Final Fantasy Action Figure",
                "One Punch Man Action Figure",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/toys/action_${i + 1}.jpg`;
            }
            if (subcat === "DOLLS") {
              const _names = [
                "Hello Kitty Doll",
                "Chiikawa Doll",
                "Mofusand Doll",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/toys/dolls_${i + 1}.jpg`;
            }
            if (subcat === "PUZZLES") {
              _startPrice = faker.number.int({ min: 10, max: 80 });
              const _names = [
                "Rubiks Cube",
                "15-Piece Puzzle",
                "Baby Toy Puzzle",
              ];
              listingName = _names[i];
              imagePath = `/images/rand/toys/puzzle_${i + 1}.jpg`;
            }
            break;
          // WATCHES
          case "LUXURY":
          case "SMARTWATCHES":
          case "CASUAL":
            if (subcat === "LUXURY") {
              _startPrice = faker.number.int({ min: 10000, max: 20000 });
              const _names = [
                "Rolex Daytona",
                "Rolex Datejust",
                "Patek Philippe",
              ];
              listingName = _names[i];

              imagePath = `/images/rand/watches/watch_${i + 1}.jpg`;
            }
            if (subcat === "SMARTWATCHES") {
              _startPrice = faker.number.int({ min: 300, max: 800 });
              const _names = ["Fitbit", "Apple Watch", "Samsung Galaxy Watch"];
              listingName = _names[i];

              imagePath = `/images/rand/watches/smartwatch_${i + 1}.jpg`;
            }
            if (subcat === "CASUAL") {
              _startPrice = faker.number.int({ min: 200, max: 700 });
              // use gshock as name because our seed images for casual watches are all gshock
              listingName = `Casio G-Shock ${faker.string.alpha({
                casing: "upper",
                length: 4,
              })}`;
              imagePath = `/images/rand/watches/casual_${i + 1}.jpg`;
            }
            break;
          // Default case for any other subcategories
          default:
            break;
        }
        const withinTheWeek = faker.date.soon({ days: 6 });
        const others = faker.date.between({
          from: subDays(new Date(), 60),
          to: addDays(new Date(), 90),
        });
        // Insert listing
        const listingId = await db
          .insert(listings)
          .values({
            // @ts-expect-error - was throwing error that userUuid is not a valid property, but it is
            userUuid: faker.helpers.arrayElement(userId),
            category: subcat.toUpperCase(),
            name: listingName,
            startingPrice: _startPrice,
            currentPrice: faker.number.int({
              min: _startPrice,
              max: _startPrice + 80,
            }),
            endTime: faker.helpers.weightedArrayElement([
              { weight: 2, value: withinTheWeek },
              { weight: 8, value: others },
            ]),
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
  return { allListings };
}
