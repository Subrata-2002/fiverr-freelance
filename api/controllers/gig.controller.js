import createError from "../utils/createError.js";
import Gig from "../models/gig.model.js"


export const createGig = async (req, res, next) => {

    // console.log(req.isSeller);
    if (!req.isSeller) {

        return next(createError(403, "Only sellers can create a gig"));
    }

    const newGig = new Gig({
        userId: req.userId,
        ...req.body,
    });

    try {
        const savedGig = await newGig.save();
        res.status(201).send(savedGig);

    } catch (error) {
        next(error);
    }

}


export const deleteGig = async (req, res, next) => {

    try {
        const gig = await Gig.findById(req.params.id);
        // console.log(gig);
        // console.log(req.userId);
        // console.log(gig.userId);
        if (gig.userId !== req.userId) {

            return next(createError(403, "You can delete only your gig not others!"));
        }

        await Gig.findByIdAndDelete(req.params.id)
        res.status(200).send("Gig has been deleted!");

    } catch (error) {
        next(error);
    }
}


export const getGig = async (req, res, next) => {

    try {

        const gig = await Gig.findById(req.params.id);
        // console.log("your gig id in gigcontr is "+gig);
        if (!gig) {
            next(createError(404, "Gig not found!!"));
        }
        res.status(200).send(gig);

    } catch (error) {
        next(error);
    }
}


// export const getGigs = async (req, res, next) => {

//     const q = req.query;
//     console.log("in gig controller and q is "+q);
//     const filters = {

//         ...(q.userId && { userId: q.userId }),

//         ...(q.cat && { cat: q.cat }),

//         ...((q.min || q.max) && {
//             price: {
//                  ...(q.min && { $gt: q.min }), 
//                  ...(q.max && { $lt: q.max }) 
//                 },
//         }),

//         ...(q.search && { title: { $regex: q.search, $options: "i" } }),
//     };

//     try {
//         const gigs = await Gig.find(filters).sort({ [q.sort] : -1});
//         res.status(200).send(gigs);

//     } catch (error) {
//         next(error);
//     }
// }

export const getGigs = async (req, res, next) => {
    const q = req.query;

    const filters = {
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: q.cat }),
        ...((q.min || q.max) && {
            price: {
                ...(q.min && { $gt: parseInt(q.min) }), // Parse min as an integer
                ...(q.max && { $lt: parseInt(q.max) }), // Parse max as an integer
            },
        }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    try {
        const sortKey = q.sort === "createdAt" ? "createdAt" : "sales"; // Define the valid sort keys
        const gigs = await Gig.find(filters).sort({ [sortKey]: -1 });
        res.status(200).send(gigs);
    } catch (error) {
        next(error);
    }
};

