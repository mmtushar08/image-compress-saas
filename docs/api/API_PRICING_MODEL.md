# API Pricing Model - Tiered Pay-As-You-Go

## New Pricing Structure

### Monthly Tiered Pricing
- **Tier 1 (Free)**: First 500 images/month - **$0.00** per image
- **Tier 2**: Images 501-11,000 (10,500 images) - **$0.008** per image
- **Tier 3**: Images 11,001+ - **$0.002** per image

### Pricing Examples

#### Example 1: 300 images/month
```
300 images × $0.00 = $0.00
Total: FREE
```

#### Example 2: 5,000 images/month
```
First 500 images × $0.00 = $0.00
Next 4,500 images × $0.008 = $36.00
Total: $36.00
```

#### Example 3: 15,000 images/month
```
First 500 images × $0.00 = $0.00
Next 10,500 images × $0.008 = $84.00
Next 4,000 images × $0.002 = $8.00
Total: $92.00
```

#### Example 4: 50,000 images/month
```
First 500 images × $0.00 = $0.00
Next 10,500 images × $0.008 = $84.00
Next 39,000 images × $0.002 = $78.00
Total: $162.00
```

---

## Current vs New Model

### Current Model (Fixed Plans)
- **Free**: 500 images/month - $0
- **API Pro**: 5,000 images/month - $19/month
- **API Ultra**: 20,000 images/month - $49/month
- **Credit Bundles**: One-time purchases

### New Model (Pay-As-You-Go)
- **No fixed plans**
- **Automatic billing** based on actual usage
- **Monthly reset** of usage counter
- **Tiered pricing** - cheaper as you use more

---

## Implementation Changes Needed

### 1. Database Schema
Add columns to track usage and billing:
```sql
ALTER TABLE users ADD COLUMN monthlyUsage INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN currentMonthCost REAL DEFAULT 0;
ALTER TABLE users ADD COLUMN lastBillingDate TEXT;
```

### 2. Pricing Calculation Function
```javascript
function calculateCost(imageCount) {
    let cost = 0;
    
    // Tier 1: First 500 free
    if (imageCount <= 500) {
        return 0;
    }
    
    // Tier 2: 501-11,000 at $0.008
    const tier2Count = Math.min(imageCount - 500, 10500);
    cost += tier2Count * 0.008;
    
    // Tier 3: 11,001+ at $0.002
    if (imageCount > 11000) {
        const tier3Count = imageCount - 11000;
        cost += tier3Count * 0.002;
    }
    
    return cost;
}
```

### 3. Usage Tracking
```javascript
exports.incrementUsage = async (providedKey) => {
    // ... existing code ...
    
    // Increment monthly usage
    db.prepare('UPDATE users SET monthlyUsage = monthlyUsage + 1 WHERE id = ?')
        .run(user.id);
    
    // Calculate current month cost
    const newUsage = user.monthlyUsage + 1;
    const newCost = calculateCost(newUsage);
    
    db.prepare('UPDATE users SET currentMonthCost = ? WHERE id = ?')
        .run(newCost, user.id);
};
```

### 4. Monthly Reset (Cron Job)
```javascript
// Reset usage on 1st of each month
cron.schedule('0 0 1 * *', () => {
    // Bill users for previous month
    const users = db.prepare('SELECT * FROM users WHERE monthlyUsage > 500').all();
    
    users.forEach(user => {
        // Create invoice/charge for currentMonthCost
        // Then reset counters
        db.prepare('UPDATE users SET monthlyUsage = 0, currentMonthCost = 0 WHERE id = ?')
            .run(user.id);
    });
});
```

---

## Questions to Consider

### 1. Billing Cycle
- **Monthly billing** on the 1st of each month?
- Or **real-time billing** after each compression?

### 2. Payment Method
- Charge credit card automatically at end of month?
- Require prepaid credits?
- Invoice-based billing?

### 3. Free Tier
- Is the 500 free images available to **everyone**?
- Or only to **registered users**?

### 4. Overage Protection
- Should there be a **spending limit**?
- Email alerts at certain thresholds (e.g., $50, $100)?

### 5. Existing Plans
- What happens to current **API Pro** and **API Ultra** users?
- Grandfather them in?
- Migrate to new pricing?

---

## Recommended Approach

### Option 1: Pure Pay-As-You-Go
- No monthly plans
- Bill at end of month based on usage
- Simple and transparent

### Option 2: Hybrid Model
- Keep existing plans for predictable pricing
- Add pay-as-you-go as an option
- Let users choose

### Option 3: Prepaid Credits
- Users buy credits upfront
- Credits deducted based on tiered pricing
- No surprise bills

---

## Next Steps

Please clarify:
1. **Billing method**: Monthly invoice, auto-charge, or prepaid?
2. **Free tier**: Everyone or registered users only?
3. **Existing users**: Migrate or grandfather?
4. **Spending limits**: Should we cap monthly spending?

Once confirmed, I can implement the new pricing model!
