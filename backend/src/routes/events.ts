import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import User from "../models/user";
import Event from "../models/event"; // this is the model <-------

const router = express.Router();
  //By using the model to find it
  //You can stack finding an event basically calling it 4 times, first by location then startDate then endDate then keyword
  //There a mongodb option to find event by date give startDate and endDate
  //After found the model return the response something like    res.status(200).json(foundEvent);
router.get('/search', async (req:Request, res:Response) => {
  try {
    //get all the location, startDate, endDeate, keyword sent from front end
    let {locationChosen,startDate,endDate,keyword} = req.query
    const regexKeyword = new RegExp(String(keyword), "i"); // Create a regular expression with the variable and make it case-insensitive
    const regexLocation = new RegExp(String(locationChosen), "i");
    //find matching data
    let event;
    //if no endDate input, we let it be one day after startDate (so that we only search for event within the day)
    if (!endDate)
    {
      const date = new Date(String(startDate).split('T')[0]);
      // Add one day to the Date object
      date.setDate(date.getDate() + 1);
      // Convert the modified Date object back to a string
      endDate = date.toISOString();
    }
      event = await Event.find({$and:[
        {location: {$regex: regexLocation}}, 
        {description:{$regex: regexKeyword}},
        {$or: [{
            startTime: {
              $gte: new Date(String(startDate)),
              $lte: new Date(String(endDate))
            }},
            {endTime: {
              $gte: new Date(String(startDate)),
              $lte: new Date(String(endDate))
            }}
          ]}
      ]})

    //if no matching event found
    if (event.length===0) {
      //set the response and return so that it will set the status and would not run the part after the if statement
      return res.status(201).json({ message: "Event not found" }); //not sure how this message is used
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})


router.post("/", verifyToken, async (req: Request, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(400).json({ message: "User does not exists!" });
  }
  if (user.role !== "organizer") {
    return res
      .status(403)
      .json({ message: "Only organizers are allowed to create events." });
  }
  const {
    title,
    description,
    startTime,
    endTime,
    venueId,
    capacity,
    location,
    categories,
    artistName,
    imageUrls,
    ticketPriceRange,
    roomChatLink,
  } = req.body;

  if (
    !title ||
    !description ||
    !startTime ||
    !endTime ||
    !location ||
    !categories ||
    !artistName ||
    !imageUrls ||
    !ticketPriceRange
  ) {
    return res.status(400).json({
      message:
        "Missing required fields: Ensure all fields including title, description, start time, end time, location, categories, artist name, image URLs, ticket price range are provided.",
    });
  }
  const existingEvent = await Event.findOne({ title, startTime, location });
  if (existingEvent) {
    return res
      .status(400)
      .json({
        message:
          "An event with the same title, start time and location already exists!",
      });
  }
  const event = new Event({
    title,
    description,
    startTime,
    endTime,
    venueId,
    capacity,
    organizerId: user.id,
    location,
    categories,
    artistName,
    imageUrls,
    ticketPriceRange,
    roomChatLink,
  });
  try {
    await event.save();
    return res
      .status(201)
      .json({ message: "Event created successfully"});
  } catch (error) {
    console.error("Failed to create event:", error);
    return res
      .status(500)
      .json({ message: "Failed to create event due to an internal error" });
  }
});

router.post('/test', verifyToken, async (req: Request, res: Response) => {
  res.status(200).json({ message: "Test successful" });
})

export default router;
