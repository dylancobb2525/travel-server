const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Joi = require('joi');
const mongoose = require('mongoose');
const app = express();
const PORT = 3004;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});
  
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb+srv://dylancobb2525_db_user:77He604CsNTXsS7X@cluster0.2w3n9nd.mongodb.net/travel-destinations?retryWrites=true&w=majority', {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

// Destination schema
const destinationSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  main_image: String,
});

const Destination = mongoose.model('Destination', destinationSchema);

// Initial destinations data for seeding (optional)
const initialDestinations = [
  {
    "_id": 1,
    "name": "Fort Lauderdale, Florida",
    "description": "This was a trip I went on with some hometown friends after graduating highschool.",
    "category": "US",
    "main_image": "fortl.png"
  },
  {
    "_id": 2,
    "name": "Boca Raton, Florida",
    "description": "This is where my mom's side of the family lives. I go atleast once per year.",
    "category": "US",
    "main_image": "boca.png"
  },
  {
    "_id": 3,
    "name": "New York City, NY",
    "description": "I live an hour from New York City, so I go as much as possible. This is a specific picture in Midtown, I really enjoy going to the SoHo area.",
    "category": "US",
    "main_image": "nyc.png"
  },
  {
    "_id": 4,
    "name": "Washington, DC",
    "description": "I went here a couple of years ago it was a really cool to see the nations capital.",
    "category": "US",
    "main_image": "dc.png"
  },
  {
    "_id": 5,
    "name": "Charleston, SC",
    "description": "I visit here on weekends when I am not busy at school. Beautiful city.",
    "category": "US",
    "main_image": "char.png"
  },
  {
    "_id": 6,
    "name": "Gatlinburg, TN",
    "description": "I went on a mountain weekend trip here with my fraternity, it was so awesome hiking the mountains.",
    "category": "US",
    "main_image": "gat.png"
  },
  {
    "_id": 7,
    "name": "Aruba",
    "description": "I have been to Aruba several times. The weather is always picture perfect and some of the best restaurants I've been to on an island.",
    "category": "International",
    "main_image": "aruba.png"
  },
  {
    "_id": 8,
    "name": "St Maarten",
    "description": "A beautiful island with amazing views and super friendly locals.",
    "category": "International",
    "main_image": "stmart.png"
  },
  {
    "_id": 9,
    "name": "St Barths",
    "description": "A small yet luxurious island that has unique shell beaches and tons of shopping.",
    "category": "International",
    "main_image": "stbart.png"
  },
  {
    "_id": 10,
    "name": "Anguilla",
    "description": "What I would call a super niche island in the Caribbean. Has the best beaches I have ever seen and amazing coral reefs.",
    "category": "International",
    "main_image": "ang.png"
  },
  {
    "_id": 11,
    "name": "Bermuda",
    "description": "Crystal clear waters and beautiful beaches that are just a short cruise ride away. Would highly recommend.",
    "category": "International",
    "main_image": "bermuda.png"
  },
  {
    "_id": 12,
    "name": "Punta Cana",
    "description": "It has been a while since I have been here but it is a great mix of island vacation and party scene.",
    "category": "International",
    "main_image": "punta.png"
  },
  {
    "_id": 13,
    "name": "Riviera Maya",
    "description": "It has been almost 8 years since I last went to Mexico, but this was a really fun vacation.",
    "category": "International",
    "main_image": "riv.png"
  },
  {
    "_id": 14,
    "name": "Niagara Falls",
    "description": "Struggled to find a good picture from this trip, but for anyone living up north this is a must see destination.",
    "category": "International",
    "main_image": "niagra.png"
  },
  {
    "_id": 15,
    "name": "Florence, Italy",
    "description": "I have never been to Europe and I want to start with Florence because it is where I plan to study abroad. Between the sight seeing and good food, this is at the top of my list.",
    "category": "Bucket List",
    "main_image": "flor.png"
  },
  {
    "_id": 16,
    "name": "Paris, France",
    "description": "The food, shopping, and landmarks such as the Eiffel Tower are all things that I hope to experience in the next few years.",
    "category": "Bucket List",
    "main_image": "paris.png"
  },
  {
    "_id": 17,
    "name": "Hawaii, USA",
    "description": "I have been to a handful of islands, but this island is definitely a must see for me one day. The nature here looks insane.",
    "category": "Bucket List",
    "main_image": "hawaii.png"
  },
  {
    "_id": 18,
    "name": "Bora Bora, French Polynesia",
    "description": "The water looks crystal clear and seems like a dream for me to experience. This is a trip I hope to take in my later 20s.",
    "category": "Bucket List",
    "main_image": "bora.png"
  },
  {
    "_id": 19,
    "name": "Morocco Desert",
    "description": "When I study abroad I hope to visit Morocco and ride a camel in the desert, as it is such a unique experience and something I have never been able to do.",
    "category": "Bucket List",
    "main_image": "moroc.png"
  },
  {
    "_id": 20,
    "name": "Dubai, UAE",
    "description": "This is a trip I plan to take later on in my life, but the luxury and insane architecture makes it so enticing to visit.",
    "category": "Bucket List",
    "main_image": "dubai.png"
  }
];

const normalizeImagePath = (imagePath = "") => {
  if (!imagePath || imagePath.startsWith('http')) {
    return imagePath;
  }
  return imagePath.startsWith('images/') ? imagePath : `images/${imagePath}`;
};

// Seed initial data if database is empty
const seedDatabase = async () => {
  const count = await Destination.countDocuments();
  if (count === 0) {
    const normalizedDestinations = initialDestinations.map(dest => ({
      ...dest,
      main_image: normalizeImagePath(dest.main_image),
    }));
    await Destination.insertMany(normalizedDestinations);
    console.log('Database seeded with initial destinations');
  }
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Get all destinations
app.get('/api/destinations', async (req, res) => {
  const destinations = await Destination.find();
  res.json(destinations);
});

// Get a single destination by ID
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const destination = await Destination.findOne({ _id: req.params.id });
    if (destination) {
      res.json(destination);
    } else {
      res.status(404).json({ message: 'Destination not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid destination ID' });
  }
});

// Post a new destination
app.post('/api/destinations', upload.single('img'), async (req, res) => {
  console.log('in post request');
  const result = validateDestination(req.body);

  if (result.error) {
    console.log('I have an error', result.error.details[0].message);
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const destination = new Destination({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
  });

  if (req.body.main_image && !req.file) {
    destination.main_image = normalizeImagePath(req.body.main_image);
  }

  if (req.file) {
    destination.main_image = normalizeImagePath(req.file.filename);
  }

  const newDestination = await destination.save();
  res.status(200).send(newDestination);
});

app.put('/api/destinations/:id', upload.single('img'), async (req, res) => {
  const isValidUpdate = validateDestination(req.body);

  if (isValidUpdate.error) {
    console.log('Invalid Info', isValidUpdate.error.details[0].message);
    res.status(400).send(isValidUpdate.error.details[0].message);
    return;
  }

  let fieldsToUpdate = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
  };

  if (req.body.main_image && !req.file) {
    fieldsToUpdate.main_image = normalizeImagePath(req.body.main_image);
  }

  if (req.file) {
    fieldsToUpdate.main_image = normalizeImagePath(req.file.filename);
  }

  try {
    const result = await Destination.updateOne(
      { _id: req.params.id },
      fieldsToUpdate
    );

    if (result.matchedCount === 0) {
      res.status(404).send('The destination you wanted to edit is unavailable');
      return;
    }

    const updatedDestination = await Destination.findOne({ _id: req.params.id });
    res.status(200).send(updatedDestination);
  } catch (error) {
    res.status(400).send('Invalid destination ID');
  }
});

app.delete('/api/destinations/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (destination) {
      res.status(200).send(destination);
    } else {
      res.status(404).send('The destination you wanted to delete is unavailable');
    }
  } catch (error) {
    res.status(400).send('Invalid destination ID');
  }
});

const validateDestination = (destination) => {
  const schema = Joi.object({
    _id: Joi.allow(''),
    name: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().valid('US', 'International', 'Bucket List').required(),
    main_image: Joi.string().optional()
  }).options({ allowUnknown: true });

  return schema.validate(destination);
};

// Start server
app.listen(PORT, async () => {
  console.log(`Travel server is running on http://localhost:${PORT}`);
  await seedDatabase();
});

