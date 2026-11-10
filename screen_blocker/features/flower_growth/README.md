# Flower Growth

**Owner:** Shadman

**Branch:** `flower_growth`

**Status:** In Progress

## Overview

Flower Growth rewards users for completing focus activities. Users earn points toward growing flowers, while choosing to bypass a blocked site reduces their active flower's progress.

## Point System

- Earn **100 points per hour** of completed activities.
- Points are awarded proportionally to the activity duration.
- Only completed activities earn points. Idle time does not count.
- Each completed activity awards points only once.
- Bypassing a blocked site deducts **100 points** from the active flower.
- Points cannot fall below zero.

### Examples

| Completed activity | Points earned |
|---|---:|
| 15 minutes | 25 |
| 30 minutes | 50 |
| 45 minutes | 75 |
| 60 minutes | 100 |
| 2 hours | 200 |

## Flower Growth Stages

Each flower requires **1,000 points** to fully bloom.

| Total points | Growth stage |
|---|---|
| 0–249 | Seedling |
| 250–499 | Sprout |
| 500–749 | Leafy |
| 750–999 | Bud |
| 1,000 | Fully Grown |

- Each growth stage represents 250 points.
- Losing points can reverse a flower's growth stage.
- Flowers can recover their previous growth as users earn points again.
- A flower takes 10 hours of completed activities to fully bloom.

### Wilting and Recovery

- When a flower loses points, it becomes wilted if its current progress falls below its previous highest point total.
- Wilted flowers use the corresponding wilted artwork for their current growth stage.
- A flower remains wilted while its current points are below its previous highest point total.
- As users earn points, the flower gradually recovers.
- Once the flower reaches its previous highest point total, it returns to its normal appearance.

## Flower Collection

- Fully grown flowers are automatically added to the permanent collection.
- Collected flowers cannot be lost, even if the user later loses points.
- After a flower is collected, a new active flower starts at zero points.
- The Display Case will show collected, fully grown flowers.

## Data Persistence

- Active flower progress is saved using browser storage.
- The active flower's current and highest point totals are stored.
- The permanent flower collection is also persisted.
- Progress remains available when the extension is closed and reopened.