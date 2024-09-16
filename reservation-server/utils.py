from functools import wraps
import inspect
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_function_call(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        func_name = func.__name__
        # Get the parameter names
        sig = inspect.signature(func)
        param_names = list(sig.parameters.keys())

        # Create a dictionary of parameter names and their values
        params = dict(zip(param_names, args))
        params.update(kwargs)

        # Log the function call with its parameters

        # Measure execution time
        start_time = time.time()

        # Call the function
        result = func(*args, **kwargs)

        # Calculate execution time
        end_time = time.time()
        execution_time = end_time - start_time

        # Log the execution time
        logger.info(f"  In the func {func_name}\n" +
                    ", ".join(f"{k}={v}" for k, v in params.items() if k != 'request\n') +
                    f"{func_name} took {execution_time:.4f} seconds to execute.")

        return result
    return wrapper
