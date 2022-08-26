UPDATE metrics
SET device = 'desktop'
WHERE device IS NULL
  AND (browser IS NOT NULL OR os IS NOT NULL);
