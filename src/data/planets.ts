export interface Planet {
  id: string;
  name: string;
  color: string;
  size: number; // relative size for visualization
  facts: {
    title: string;
    value: string;
    explanation?: string; // Optional detailed explanation
  }[];
  description: string;
  distanceFromSun: string;
  diameter: string;
  dayLength: string;
  texture?: string;
  bumpMap?: string;
  specularMap?: string;
  cloudsTexture?: string;
  cloudsAlpha?: string;
  ringTexture?: string;
  moons?: {
    id: string;
    name: string;
    texture: string;
    size: number;
    orbitRadius: number;
    orbitSpeed: number;
  }[];
}

export const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercurius',
    color: '#8C7853',
    size: 0.4,
    distanceFromSun: '57,9 miljoen km',
    diameter: '4.879 km',
    dayLength: '59 aardse dagen',
    texture: './textures/mercury.jpg',
    bumpMap: './textures/mercury-bump.jpg',
    facts: [
      { title: 'Afstand tot de zon', value: '57,9 miljoen km' },
      { title: 'Diameter', value: '4.879 km' },
      { title: 'Daglengte', value: '59 aardse dagen', explanation: 'Een dag op Mercurius duurt bijna 59 aardse dagen omdat de planeet zo langzaam om zijn as draait. Ironisch genoeg is een jaar op Mercurius (88 dagen) korter dan een dag!' }
    ],
    description: 'De kleinste planeet en het dichtst bij de zon. Overdag extreem heet, \'s nachts ijskoud.'
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#FFC649',
    size: 0.9,
    distanceFromSun: '108,2 miljoen km',
    diameter: '12.104 km',
    dayLength: '243 aardse dagen',
    texture: './textures/venus.jpg',
    bumpMap: './textures/venus-bump.jpg',
    facts: [
      { title: 'Afstand tot de zon', value: '108,2 miljoen km' },
      { title: 'Diameter', value: '12.104 km' },
      { title: 'Bijzonderheid', value: 'Heetste planeet (465°C)', explanation: 'Venus is heter dan Mercurius, ondanks dat het verder van de zon staat. Dit komt door een extreme broeikaseffect: de dikke atmosfeer van koolstofdioxide houdt de warmte gevangen, waardoor het zelfs heter wordt dan op Mercurius.' }
    ],
    description: 'De heetste planeet door een dicht broeikaseffect. Ook wel de ochtend- of avondster genoemd.'
  },
  {
    id: 'earth',
    name: 'Aarde',
    color: '#4169E1',
    size: 1,
    distanceFromSun: '149,6 miljoen km',
    diameter: '12.742 km',
    dayLength: '24 uur',
    texture: './textures/earth.jpg',
    bumpMap: './textures/earth-bump.jpg',
    specularMap: './textures/earth-specular.jpg',
    cloudsTexture: './textures/earth-clouds.jpg',
    cloudsAlpha: './textures/earth-clouds-alpha.jpg',
    moons: [
      {
        id: 'moon',
        name: 'Maan',
        texture: './textures/moon.jpg',
        size: 0.27,
        orbitRadius: 2.5,
        orbitSpeed: 0.5
      }
    ],
    facts: [
      { title: 'Afstand tot de zon', value: '149,6 miljoen km' },
      { title: 'Diameter', value: '12.742 km' },
      { title: 'Bijzonderheid', value: 'Enige planeet met leven', explanation: 'De Aarde is de enige bekende planeet waar leven bestaat. Dit komt door de perfecte combinatie van vloeibaar water, een beschermende atmosfeer, en de juiste afstand tot de zon - niet te heet en niet te koud.' }
    ],
    description: 'Onze thuisplaneet. De enige bekende plek in het universum met leven.'
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#CD5C5C',
    size: 0.5,
    distanceFromSun: '227,9 miljoen km',
    diameter: '6.779 km',
    dayLength: '24,6 uur',
    texture: './textures/mars.jpg',
    bumpMap: './textures/mars-bump.jpg',
    facts: [
      { title: 'Afstand tot de zon', value: '227,9 miljoen km' },
      { title: 'Diameter', value: '6.779 km' },
      { title: 'Bijzonderheid', value: 'De rode planeet', explanation: 'Mars heeft zijn rode kleur te danken aan ijzeroxide (roest) in de grond. De planeet heeft ook de hoogste berg van het hele zonnestelsel: Olympus Mons is 21 kilometer hoog - bijna drie keer zo hoog als de Mount Everest!' }
    ],
    description: 'Rood door ijzeroxide in de bodem. Heeft de hoogste berg van het zonnestelsel.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: '#DAA520',
    size: 2.5,
    distanceFromSun: '778,5 miljoen km',
    diameter: '139.820 km',
    dayLength: '10 uur',
    texture: './textures/jupiter.jpg',
    moons: [
      {
        id: 'io',
        name: 'Io',
        texture: './textures/io.jpg',
        size: 0.28,
        orbitRadius: 2.8,
        orbitSpeed: 0.8
      },
      {
        id: 'europa',
        name: 'Europa',
        texture: './textures/europa.jpg',
        size: 0.24,
        orbitRadius: 3.2,
        orbitSpeed: 0.6
      },
      {
        id: 'ganymede',
        name: 'Ganymedes',
        texture: './textures/ganymede.jpg',
        size: 0.41,
        orbitRadius: 3.8,
        orbitSpeed: 0.4
      },
      {
        id: 'callisto',
        name: 'Callisto',
        texture: './textures/callisto.jpg',
        size: 0.38,
        orbitRadius: 4.4,
        orbitSpeed: 0.3
      }
    ],
    facts: [
      { title: 'Afstand tot de zon', value: '778,5 miljoen km' },
      { title: 'Diameter', value: '139.820 km' },
      { title: 'Bijzonderheid', value: 'Grootste planeet', explanation: 'Jupiter is zo groot dat er meer dan 1.300 Aardes in zouden passen! De iconische "Grote Rode Vlek" is een gigantische storm die al minstens 400 jaar woest - groot genoeg om twee of drie Aardes in te laten passen.' }
    ],
    description: 'De grootste planeet van het zonnestelsel. Een gasreus met een iconische rode vlek.'
  },
  {
    id: 'saturn',
    name: 'Saturnus',
    color: '#F4A460',
    size: 2.2,
    distanceFromSun: '1,43 miljard km',
    diameter: '116.460 km',
    dayLength: '10,7 uur',
    texture: './textures/saturn.jpg',
    ringTexture: './textures/saturn-ring.png',
    moons: [
      {
        id: 'titan',
        name: 'Titan',
        texture: './textures/titan.webp',
        size: 0.40,
        orbitRadius: 3.5,
        orbitSpeed: 0.35
      }
    ],
    facts: [
      { title: 'Afstand tot de zon', value: '1,43 miljard km' },
      { title: 'Diameter', value: '116.460 km' },
      { title: 'Bijzonderheid', value: 'Prachtige ringen', explanation: 'De ringen van Saturnus bestaan uit miljarden stukjes ijs en gesteente, variërend van zandkorrelgrootte tot huisgrote brokken. Ze zijn 280.000 km breed, maar slechts 10 meter dik! Saturnus is ook zo licht dat het zou drijven in water.' }
    ],
    description: 'Bekend om zijn prachtige ringsysteem van ijs en rotsen. Zou drijven in water.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: '#4FD0E0',
    size: 1.8,
    distanceFromSun: '2,87 miljard km',
    diameter: '50.724 km',
    dayLength: '17 uur',
    texture: './textures/uranus.jpg',
    facts: [
      { title: 'Afstand tot de zon', value: '2,87 miljard km' },
      { title: 'Diameter', value: '50.724 km' },
      { title: 'Bijzonderheid', value: 'Draait op zijn zij', explanation: 'Uranus kantelde waarschijnlijk door een botsing met een ander hemellichaam vroeg in zijn geschiedenis. Hierdoor draait de planeet bijna horizontaal, met zijn polen naar de zon gericht. Dit zorgt voor extreme seizoenen: elke pool krijgt 42 jaar ononderbroken zonlicht, gevolgd door 42 jaar duisternis.' }
    ],
    description: 'Een ijsreus die op zijn zij draait. Heeft een blauwe kleur door methaan.'
  },
  {
    id: 'neptune',
    name: 'Neptunus',
    color: '#4169E1',
    size: 1.7,
    distanceFromSun: '4,50 miljard km',
    diameter: '49.244 km',
    dayLength: '16 uur',
    texture: './textures/neptune.jpg',
    moons: [
      {
        id: 'triton',
        name: 'Triton',
        texture: './textures/triton.jpg',
        size: 0.21,
        orbitRadius: 2.8,
        orbitSpeed: 0.45
      }
    ],
    facts: [
      { title: 'Afstand tot de zon', value: '4,50 miljard km' },
      { title: 'Diameter', value: '49.244 km' },
      { title: 'Bijzonderheid', value: 'Sterkste winden', explanation: 'Neptunus heeft de krachtigste winden in het zonnestelsel, met snelheden tot 2.100 km/u - supersonisch! Dit is verbazingwekkend omdat de planeet zo ver van de zon staat en dus weinig energie ontvangt. Wetenschappers begrijpen nog steeds niet volledig waar deze extreme winden vandaan komen.' }
    ],
    description: 'De verste planeet met de sterkste winden in het zonnestelsel tot 2.100 km/u.'
  },
  {
    id: 'pluto',
    name: 'Pluto',
    color: '#A89080',
    size: 0.2,
    distanceFromSun: '5,91 miljard km',
    diameter: '2.377 km',
    dayLength: '6,4 aardse dagen',
    facts: [
      { title: 'Afstand tot de zon', value: '5,91 miljard km' },
      { title: 'Diameter', value: '2.377 km' },
      { title: 'Bijzonderheid', value: 'Dwergplaneet sinds 2006', explanation: 'Pluto werd in 2006 gedeclassificeerd van planeet naar dwergplaneet omdat het zijn baan niet heeft "vrijgemaakt" van ander puin. Pluto heeft een hartvormige ijsvlakte genaamd Tombaugh Regio en vijf manen, waarvan de grootste (Charon) zo groot is dat Pluto en Charon rond elkaar draaien als een dubbelsysteem.' }
    ],
    description: 'Ooit de 9e planeet, nu een dwergplaneet. Heeft een hartvormige ijsvlakte genaamd Tombaugh Regio.'
  }
];
