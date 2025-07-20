import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error = { ...err };
    error.message = err.message;

    // Log the full error for debugging
    console.error("=== ERROR DETAILS ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("Error code:", err.code);
    console.error("Full error object:", err);
    console.error("=====================");

    // Handle different types of errors
    switch (err.name) {
      case "CastError":
        error.message = "Resource not found - Invalid ID format";
        error.statusCode = 404;
        break;

      case "ValidationError":
        const messages = Object.values(err.errors).map(
          (val: any) => val.message
        );
        error.message = messages.join(", ");
        error.statusCode = 400;
        break;

      case "TypeError":
        // Handle property access errors (like accessing undefined properties)
        if (
          err.message.includes("Cannot read properties of undefined") ||
          err.message.includes("Cannot read property")
        ) {
          error.message = `Property access error: ${err.message}`;
          error.statusCode = 500;
        } else {
          error.message = err.message || "Type error occurred";
          error.statusCode = 500;
        }
        break;

      case "ReferenceError":
        error.message = `Reference error: ${err.message}`;
        error.statusCode = 500;
        break;

      default:
        // Handle MongoDB duplicate key errors
        if (err.code === 11000) {
          error.message = "Duplicate field value entered";
          error.statusCode = 400;
        } else {
          error.message = err.message || "Server Error";
          error.statusCode = err.statusCode || 500;
        }
    }

    // Send error response
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
        details: err,
      }),
    });
  } catch (middlewareError) {
    // If error middleware itself fails, send a generic error
    console.error("Error middleware failed:", middlewareError);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export default errorMiddleware;
