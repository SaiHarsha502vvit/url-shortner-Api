import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    customAlias: {
        type: String,
        unique: true,
        sparse: true
    },
    expirationDate: {
        type: Date,
        default: null
    },
    clickHistory: [{
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],updateHistory: [{
        originalUrl: String,
        shortId: String,
        expirationDate: Date,
        updatedAt: { type: Date, default: Date.now }
    }]
});

const Url = mongoose.model('Url', urlSchema);
export default Url;