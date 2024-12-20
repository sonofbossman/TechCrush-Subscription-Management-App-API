// subscriptionRoutes.js
import express from 'express';
import {
  createSubscription,
  getSubscriptions,
  findSubscription,
  updateSubscription,
  deleteSubscription
} from '../controllers/subController.js'; 

const subscriptionRoutes = express.Router(); // Create a new router for subscriptions

// Create a new subscription
subscriptionRoutes.post('/', async (req, res) => {
  const { userId, planId, paymentMethodId } = req.body; // Destructure the request body
  try {
    const newSubscription = await createSubscription(userId, planId, paymentMethodId);
    res.status(201).json({ message: "Subscription created", subscription: newSubscription });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all subscriptions
subscriptionRoutes.get('/', async (req, res) => {
  try {
    const subscriptions = await getSubscriptions();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find a subscription by ID
subscriptionRoutes.get('/:id', async (req, res) => {
  const { id } = req.params; // Gets the subscription ID from the request parameters
  try {
    const foundSubscription = await findSubscription(id);
    if (foundSubscription) {
      res.status(200).json(foundSubscription);
    } else {
      res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a subscription
subscriptionRoutes.put('/:id', async (req, res) => {
  const { id } = req.params; 
  const updates = req.body; 
  try {
    const updatedSubscription = await updateSubscription(id, updates);
    if (updatedSubscription) {
      res.status(200).json({ message: 'Subscription updated successfully', subscription: updatedSubscription });
    } else {
      res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a subscription
subscriptionRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSubscription = await deleteSubscription(id);
    if (deletedSubscription) {
      res.status(200).json({ message: 'Subscription deleted successfully' });
    } else {
      res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default subscriptionRoutes; 