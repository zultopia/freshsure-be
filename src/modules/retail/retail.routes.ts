import { Router } from 'express';
import retailController from './retail.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Stores
router.post('/stores', authenticate, authorize('RETAIL', 'ADMIN'), retailController.createStore.bind(retailController));

// Inventory
router.post('/inventory', authenticate, authorize('RETAIL', 'ADMIN'), retailController.createInventory.bind(retailController));
router.get('/inventory', authenticate, retailController.getInventory.bind(retailController));
router.get('/inventory/low-stock', authenticate, retailController.getLowStock.bind(retailController));

// Pricing
router.post('/pricing/recommendations', authenticate, authorize('RETAIL', 'ADMIN'), retailController.createPricingRecommendation.bind(retailController));
router.get('/pricing/recommendations', authenticate, retailController.getPricingRecommendations.bind(retailController));

export default router;

