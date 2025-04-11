import mongoose from "mongoose";


const SubsHistorySchema = new mongoose.Schema(
    {

        username:{
            type: String,
            require : true,
          },
      role: {
        type: String,
        enum: ['admin', 'friend'],
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      platform: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        default: null,
      },
      currency: {
        type: String,
        required: true,
      },
      collaborations: {
        type: [String],
        default: [],
      },
      startDate: {
        type: Date,
        required: true,
      },
      durationType: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'custom'],
        required: true,
      },
      endDate: {
        type: Date,
        // endDate is required only if durationType is 'custom'
      },
      paymentMethod: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['active', 'paused', 'cancelled'],
        required: true,
      },
    },
    {
      timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
  );
  
  // Validate that an endDate is provided when durationType is 'custom'
  SubsHistorySchema.pre('save', function (next) {
    if (this.durationType === 'custom' && !this.endDate) {
      return next(new Error('endDate is required when durationType is custom'));
    }
    next();
  });
  
export default  mongoose.model('SubsHistory', SubsHistorySchema);