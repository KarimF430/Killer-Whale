# Variant Page Filter Issue Analysis

## Current Implementation

The variant page has filter logic implemented (lines 339-410 in VariantPage.tsx):

1. **Filter State**: `selectedFilters` (line 87)
2. **Filter Toggle**: `handleFilterToggle()` (lines 340-354)
3. **Dynamic Filters**: `getDynamicFilters()` (lines 357-383)
4. **Filter Function**: `getFilteredVariants()` (lines 388-408)
5. **Filtered Display**: Uses `filteredVariants` (line 2436-2437)

## The Problem

Filters are rendered and clickable, but variants aren't being filtered correctly.

## Root Cause

Looking at the filter matching logic (lines 393-407), the issue is likely:

1. The `transformedVariants` data structure (lines 326-337) uses:
   - `fuel`: from `v.fuel`
   - `transmission`: from `v.transmission`

2. The filter logic checks:
   - `v.fuel === filter` (exact match)
   - Automatic/Manual transmission detection

The data might not be matching because:
- Fuel type casing (e.g., "Petrol" vs "petrol")
- Transmission type variations (e.g., "Manual Transmission" vs "Manual")

## Solution

Make the filter matching case-insensitive and more flexible.
