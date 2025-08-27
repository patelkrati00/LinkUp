import { Schema,model } from "mongoose";

const meetingSchema = new Schema({
    user_id: {type:String},
    meetingCode: {type:String, required:true, unique:true},
    date: {type: Date, default: Date.now, required:true},
});

const Meeting = model('Meeting', meetingSchema);

export default Meeting;