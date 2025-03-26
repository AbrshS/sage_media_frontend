interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'white';
    fullScreen?: boolean;
  }
  
  export default function Loading({ 
    size = 'md', 
    color = 'primary',
    fullScreen = false 
  }: LoadingProps) {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
  
    const colorClasses = {
      primary: 'border-primary/30 border-t-primary',
      white: 'border-white/30 border-t-white'
    };
  
    if (fullScreen) {
      return (
        <div className="fixed inset-0 bg-secondary-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${sizeClasses[size]} border-2 rounded-full animate-spin ${colorClasses[color]}`} />
        </div>
      );
    }
  
    return (
      <div className={`${sizeClasses[size]} border-2 rounded-full animate-spin ${colorClasses[color]}`} />
    );
  }