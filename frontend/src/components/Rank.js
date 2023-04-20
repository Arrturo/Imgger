import React from 'react'

function Rank({points}) {
  return (
    <div className="rating text-amber-400 text-4xl inline-block mx-5">
        <span>
            
            <i className={
                points >= 15 
                    ? 'fa-solid fa-star' 
                        : 'fa-regular fa-star'    
            }>
            </i>
        </span> 
        <span>
            <i className={
                points >= 30 
                    ? 'fa-solid fa-star' 
                        : 'fa-regular fa-star'    
            }>
            </i>
        </span> 
        <span>
            <i className={
                points >= 50 
                    ? 'fa-solid fa-star' 
                        : 'fa-regular fa-star'    
            }>
            </i>
        </span> 
        <span>
            <i className={
                points >= 75 
                    ? 'fa-solid fa-star' 
                        : 'fa-regular fa-star'    
            }>
            </i>
        </span> 
        <span>
            <i className={
                points >= 100 
                    ? 'fa-solid fa-star' 
                        : 'fa-regular fa-star'    
            }>
            </i>
        </span>
        <span className='mx-3 text-red-500'>
            {points >= 100 ? 'master' :
                points >= 75 ? 'star' :
                    points >= 50 ? 'solid player':
                        points >= 30 ? 'amateur' :
                            points >= 15 ? 'beginner' : null
                    }

        </span> 

    </div>
  )
}

export default Rank