from flask import jsonify
from functools import wraps

def handle_errors(f):
    """Decorator for consistent error handling across APIs."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500
    return decorated_function

def validate_required_fields(data, required_fields):
    """Validate that all required fields are present."""
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

def paginate_results(query, page=1, per_page=20):
    """Paginate query results."""
    paginated = query.paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )
    return {
        'items': [item.to_dict() for item in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages,
        'current_page': page,
        'per_page': per_page
    }
