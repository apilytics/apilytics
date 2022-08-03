UPDATE metrics

SET dynamic_route_id = (
    SELECT id
    FROM dynamic_routes

    WHERE dynamic_routes.origin_id = metrics.origin_id
        AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
        = LENGTH(dynamic_routes.pattern) - LENGTH(REPLACE(dynamic_routes.pattern, '/', ''))

    LIMIT 1
),

excluded_route_id = (
    SELECT id
    FROM excluded_routes

    WHERE excluded_routes.origin_id = metrics.origin_id
        AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
        = LENGTH(excluded_routes.pattern) - LENGTH(REPLACE(excluded_routes.pattern, '/', ''))

    LIMIT 1
);
