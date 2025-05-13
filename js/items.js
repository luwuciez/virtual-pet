export const FOODS = {
  fish: { name: "Fish", value: 20, image: "../assets/food/fish.png" },
  egg: { name: "Egg", value: 20, image: "../assets/food/egg.png" },
  candy: { name: "Candy", value: 20, image: "../assets/food/candy.png" },
  apple: { name: "Apple", value: 20, image: "../assets/food/apple.png" },
  bread: { name: "Bread", value: 20, image: "../assets/food/bread.png" },
};

export const TOYS = {
  balloon: { name: "Balloon", value: 20, image: "../assets/toy/balloon.png" },
  slinky: { name: "Slinky", value: 20, image: "../assets/toy/slinky.png" },
  paddleBall: { name: "Paddle Ball", value: 20, image: "../assets/toy/paddleball.png" },
  teddyBear: { name: "Teddy Bear", value: 20, image: "../assets/toy/teddy_bear.png" },
  musicBox: { name: "Music Box", value: 20, image: "../assets/toy/music_box.png" },
};

export const PETS = {
  daisy: {
    name: "Daisy",
    description: "Friendly but a little dumb.",
    favFoods: ["candy", "egg"],
    favToys: ["paddleBall", "slinky"],
    stages: {
      stage1: ["../assets/daisy/stage1a.png", "../assets/daisy/stage1b.png"],
      stage2: ["../assets/daisy/stage2a.png", "../assets/daisy/stage2b.png"],
      stage3: ["../assets/daisy/stage3a.png", "../assets/daisy/stage3b.png"],
      dead: "../assets/dead.png",
    },
  },
  spike: {
    name: "Spike",
    description: "Independent and rebellious.",
    favFoods: ["apple", "bread"],
    favToys: ["slinky", "musicBox"],
    stages: {
      stage1: ["../assets/spike/stage1a.png", "../assets/spike/stage1b.png"],
      stage2: ["../assets/spike/stage2a.png", "../assets/spike/stage2b.png"],
      stage3: ["../assets/spike/stage3a.png", "../assets/spike/stage3b.png"],
      dead: "../assets/dead.png",
    },
  },
  lily: {
    name: "Lily",
    description: "Shy and sweet, treat with care.",
    favFoods: ["fish", "candy"],
    favToys: ["balloon", "teddyBear"],
    stages: {
      stage1: ["../assets/lily/stage1a.png", "../assets/lily/stage1b.png"],
      stage2: ["../assets/lily/stage2a.png", "../assets/lily/stage2b.png"],
      stage3: ["../assets/lily/stage3a.png", "../assets/lily/stage3b.png"],
      dead: "../assets/dead.png",
    },
  },
};
