/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { LoadingOverlay } from '@/app/components/LoadingOverlay/LoadingOverlay';
import { Map } from '@/app/components/map/Map';
import { RouteStops } from '@/app/components/RouteStops/RouteStops';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { SignIn } from '@/app/components/signin/Signin';
import { Background } from '@/app/components/Background/Background';
import { Navbar } from '@/app/components/Navbar/Navbar';
import { useRef, useState } from 'react';

import { formSchema } from '@/app/components/PromptForm/PromptFormSchema';
import { PromptForm } from '@/app/components/PromptForm/PromptForm';
import { type FormData } from '@/app/components/PromptForm/PromptFormSchema';
import { useGetuser } from '@/app/hooks/getUser';
import { usePubMarkers } from '@/app/hooks/getMarkers';
export default function Page() {
  const { user, setUser } = useGetuser();
  const [showForm, setShowForm] = useState<boolean>(true);
  const [activeMarkerId, setActiveMarkerId] = useState<string | undefined>();
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { pubs, markers, isLoading, handleSubmit, handleGetRoute } =
    usePubMarkers(() => setShowForm(false));

  const resetMapRef = useRef<() => void>(() => {});

  const handleResetMap = () => {
    if (resetMapRef.current) {
      resetMapRef.current(); // Call the exposed `fitBounds` function
    }
  };

  if (user) {
    return (
      <div className="relative w-full">
        <Navbar user={user} setUser={setUser} />
        <Background>
          <div className="flex flex-col w-full items-center  py-24 mx-auto stretch">
            {isLoading && <LoadingOverlay />}

            <div
              className={`transition-opacity duration-300 w-full flex justify-center ${showForm ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
            >
              <PromptForm
                onSubmit={handleFormSubmit(handleSubmit)}
                errors={Object.fromEntries(
                  Object.entries(errors).map(([key, error]) => [
                    key,
                    { message: error.message || '' },
                  ])
                )}
                setValue={setValue}
                // @ts-expect-error
                register={register}
              />
            </div>

            <div
              className={`transition-opacity duration-300 w-full flex flex-col justify-center  ${!showForm ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
            >
              <div className="flex p-8">
                <Map
                  markers={markers}
                  activeMarkerId={activeMarkerId}
                  resetMap={(fitBoundsCallback) => {
                    resetMapRef.current = fitBoundsCallback;
                  }}
                />
                <div className="flex flex-col h-full justify-between">
                  <RouteStops
                    setActiveMarkerId={setActiveMarkerId}
                    locations={pubs}
                  />
                  <button
                    disabled={pubs.length === 0}
                    onClick={handleGetRoute}
                    className="mt-4 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    See Route
                  </button>
                  <button
                    onClick={handleResetMap}
                    className="mt-4 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Zoom out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Background>
      </div>
    );
  }

  return <SignIn />;
}
