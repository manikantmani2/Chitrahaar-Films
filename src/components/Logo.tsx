import Image from 'next/image';
import React from 'react';

type LogoProps = {
  size?: number;
  withText?: boolean;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ size = 40, withText = false, className = '' }) => {
  const outer = Math.max(48, size + 16);
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Image
        src="/chitrahaar-logo.png"
        alt="Chitrahaar Films logo"
        width={outer}
        height={outer}
        priority
      />

      {withText && (
        <div className="mt-2 text-center">
          <div className="text-sm tracking-widest text-accent font-semibold">CHITRAHAAR FILMS</div>
        </div>
      )}
    </div>
  );
};

export default Logo;

