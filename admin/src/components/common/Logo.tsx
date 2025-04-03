import React from "react";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
  useImage?: boolean;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = "medium", 
  className = "",
  useImage = false,
  textColor = "primary"
}) => {
  const sizeClasses = {
    small: "text-xs h-4",
    medium: "text-sm h-5",
    large: "text-lg h-6",
  };

  const imageSizes = {
    small: "h-4",
    medium: "h-5",
    large: "h-6",
  };

  if (useImage) {
    return (
      <div className={`font-bold ${className}`}>
        <img 
          src="/logo.png" 
          alt="Pantry by Marble" 
          className={className || imageSizes[size]} 
        />
      </div>
    );
  }

  return (
    <div className={`font-bold ${sizeClasses[size]} ${className}`}>
      <span className={`text-${textColor === "white" ? "white" : "primary"}`}>Pantry</span>
      <span className={`text-${textColor === "white" ? "white" : "muted-foreground"} mx-1`}>by</span>
      <span className={`text-${textColor === "white" ? "white" : "accent-foreground"}`}>Marble</span>
    </div>
  );
};

export default Logo;
