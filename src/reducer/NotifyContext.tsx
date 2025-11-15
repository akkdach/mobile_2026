import React, { useState, createContext, useEffect, useCallback, useContext } from 'react';
import { getNotiCount } from '../services/NotiService';

export const NotifyContext = createContext<any[]>([]);
export const UseNotiContext = () => useContext(NotifyContext);

export const NotifyContextProvider = (props: any) => {
  const [workNotify, setWorkNotify] = useState<any>({
    knowledgeCount: 0,
    newsCount: 0,
    workOrderCount: 0,

  });
  const [notiCount,setNotiCount] = useState<any>({
    spare_part_approve: 0,
    to_approve: 0
  })

  // useEffect(() => {
  //     fetNoniCount();
  // }, [])

  const fetNoniCount = async() => {
    const result = await getNotiCount();
    if (result.dataResult) {
      var newdata = { ...notiCount,...result.dataResult }
      console.log('notiCount', newdata);
      setNotiCount(newdata);
    }
  }



  return (
    <NotifyContext.Provider value={[workNotify, setWorkNotify,notiCount,fetNoniCount]}>
      {props.children}
    </NotifyContext.Provider>
  );
};
