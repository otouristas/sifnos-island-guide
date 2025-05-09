
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  author: string;
  date: string;
  featuredImage: string;
  excerpt: string;
  content: string;
  categories: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Top 10 Beaches in Sifnos You Must Visit",
    slug: "top-10-beaches-in-sifnos",
    author: "Maria Papadopoulos",
    date: "May 15, 2025",
    featuredImage: "/uploads/beaches/plats-gialos.webp",
    excerpt: "Discover the most beautiful beaches in Sifnos, from the popular Platis Gialos to the secluded Vroulidia. Each beach offers a unique experience with crystal-clear waters.",
    categories: ["Beaches", "Travel Tips"],
    content: `
      <p>Sifnos is home to some of the most beautiful beaches in the Cyclades. Whether you're looking for organized beaches with amenities or secluded coves for privacy, Sifnos has it all.</p>
      
      <h2>1. Platis Gialos</h2>
      <p>The longest and most popular beach on the island, Platis Gialos is a sandy beach with clear blue waters. The beach is lined with tavernas, cafes, and hotels, making it perfect for families.</p>
      
      <h2>2. Vathi</h2>
      <p>A picturesque bay with a sandy beach and shallow waters, ideal for children. The beach is surrounded by tamarisk trees providing natural shade.</p>
      
      <h2>3. Kamares</h2>
      <p>The main port of Sifnos offers a long, sandy beach with plenty of facilities. Its protected location makes it a good option even on windy days.</p>
      
      <h2>4. Faros</h2>
      <p>A family-friendly beach with calm waters, located in a charming fishing village. The area has several small coves to explore.</p>
      
      <h2>5. Chrysopigi</h2>
      <p>Named after the nearby monastery, this beach features crystal clear waters and is divided into two parts by rocky outcrops.</p>
      
      <h2>6. Vroulidia</h2>
      <p>A secluded beach accessible by a dirt road and a short hike down. The effort is worth it for the pristine waters and peaceful atmosphere.</p>
      
      <h2>7. Heronissos</h2>
      <p>A small pebble beach in the northernmost part of the island with a few fish tavernas known for fresh seafood.</p>
      
      <h2>8. Apokofto</h2>
      <p>Located near Chrysopigi, this is a sandy beach with shallow waters and good facilities.</p>
      
      <h2>9. Glyfo</h2>
      <p>A quiet, sandy beach near Faros with tamarisk trees providing shade.</p>
      
      <h2>10. Fykiada</h2>
      <p>A remote beach on the southwest side of the island, perfect for those seeking tranquility.</p>
      
      <p>When visiting the beaches of Sifnos, remember to bring water, sunscreen, and respect the natural environment by taking your trash with you.</p>
    `
  },
  {
    id: 2,
    title: "Traditional Sifnian Cuisine: A Culinary Journey",
    slug: "traditional-sifnian-cuisine",
    author: "Nikos Dimitriou",
    date: "April 28, 2025",
    featuredImage: "/uploads/beaches/apollonia.webp",
    excerpt: "Explore the rich culinary traditions of Sifnos, an island known for its exceptional food. From mastelo to revithada, discover the flavors that make Sifnos a gastronomic paradise.",
    categories: ["Gastronomy", "Culture"],
    content: `
      <p>Sifnos has a well-deserved reputation as a gastronomic destination in the Cyclades. The island's cuisine is characterized by simple ingredients, slow cooking, and the use of herbs and spices that grow on the island.</p>
      
      <h2>The Pottery Connection</h2>
      <p>Sifnos is famous for its pottery, and this tradition is deeply connected to its cuisine. Many traditional dishes are cooked in clay pots, which give them their distinctive flavor.</p>
      
      <h2>Must-Try Traditional Dishes</h2>
      
      <h3>Mastelo</h3>
      <p>Lamb or goat marinated in red wine and herbs, then slow-cooked in a clay pot. Traditionally prepared for Easter celebrations.</p>
      
      <h3>Revithada</h3>
      <p>Chickpeas baked overnight in a clay pot with olive oil and herbs. This dish is typically served on Sunday lunches.</p>
      
      <h3>Manoura</h3>
      <p>A local cheese made from goat's milk, aged in wine dregs, giving it a distinctive flavor and aroma.</p>
      
      <h3>Melopita</h3>
      <p>A traditional dessert made with local honey and fresh cheese, similar to a cheesecake.</p>
      
      <h2>Where to Eat in Sifnos</h2>
      
      <p>Sifnos has numerous tavernas and restaurants where you can sample authentic local cuisine:</p>
      
      <ul>
        <li><strong>Omega 3</strong> in Platis Gialos for seafood with a creative twist</li>
        <li><strong>Leonidas</strong> in Apollonia for traditional recipes</li>
        <li><strong>To Tsikali</strong> in Vathi for fresh fish by the sea</li>
        <li><strong>Drimoni</strong> in Apollonia for local specialties</li>
      </ul>
      
      <p>When dining in Sifnos, don't rush. Take your time to enjoy the food, the atmosphere, and the company - this is the Greek way!</p>
    `
  },
  {
    id: 3,
    title: "A Guide to Sifnos Villages: Exploring Apollonia, Kastro, and Beyond",
    slug: "guide-to-sifnos-villages",
    author: "Elena Koutsoukou",
    date: "April 10, 2025",
    featuredImage: "/uploads/beaches/kastro.webp",
    excerpt: "Discover the charming villages of Sifnos, each with its unique character and attractions. From the bustling capital of Apollonia to the medieval settlement of Kastro.",
    categories: ["Travel Tips", "Culture"],
    content: `
      <p>Sifnos is dotted with picturesque villages that showcase the island's rich history and traditional Cycladic architecture. Each village has its own character and attractions worth exploring.</p>
      
      <h2>Apollonia</h2>
      <p>The capital of Sifnos is a typical Cycladic settlement with whitewashed houses and narrow alleys. Named after god Apollo, it's the main hub of the island with numerous shops, restaurants, and bars. Don't miss the folklore museum and the church of Panagia Ouranofora.</p>
      
      <h2>Kastro</h2>
      <p>A medieval settlement built on a rocky hill overlooking the sea. Kastro has preserved much of its medieval character with narrow streets and ancient walls. The Archaeological Museum of Sifnos is located here, housing finds from the ancient acropolis.</p>
      
      <h2>Artemonas</h2>
      <p>Known for its neoclassical mansions and elegant architecture, Artemonas is one of the most beautiful villages on the island. The village offers spectacular views and some of the best traditional pastry shops on Sifnos.</p>
      
      <h2>Kamares</h2>
      <p>The main port of Sifnos is a picturesque coastal village with a long sandy beach. It's the first impression most visitors get of the island and features a good selection of accommodation, tavernas, and shops.</p>
      
      <h2>Faros</h2>
      <p>A charming fishing village with three consecutive beaches. The village is named after the lighthouse ("faros" in Greek) that once stood here. It's a peaceful place ideal for relaxation.</p>
      
      <h2>Vathi</h2>
      <p>A seaside village built around a natural bay with a beautiful sandy beach. The village is known for its pottery workshops and the church of Taxiarches with its impressive blue dome.</p>
      
      <h2>Exambela</h2>
      <p>Located near Apollonia, this village is known for its pottery tradition. Many pottery workshops can be visited here.</p>
      
      <h2>Getting Around</h2>
      <p>The villages of Sifnos are connected by a good road network and regular bus services. Renting a car or scooter is recommended for exploring at your own pace. Many of the villages are also connected by well-marked hiking trails, offering a more immersive experience of the island's landscape.</p>
    `
  }
];
