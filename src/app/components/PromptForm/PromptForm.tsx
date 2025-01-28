import { AsyncLocationSearch } from '@/app/components/AsyncLocationSearch/AsyncLocationSearch';
import { Send } from 'lucide-react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

type PromptFormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errors: Record<string, { message: string }>;
  register: UseFormRegister<{
    vibe: string;
    location: string;
  }>;
  setValue: UseFormSetValue<{
    vibe: string;
    location: {
      value: {
        lat: string;
        lon: string;
        osmId: number;
      };
      type: string;
      label: string;
      importance: number;
    };
  }>;
};

export const PromptForm = ({
  onSubmit,
  errors,
  register,
  setValue,
}: PromptFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-xl p-6 border border-gray-200 rounded-xl shadow-sm bg-white space-y-4"
    >
      <div className="space-y-2">
        <label
          htmlFor="vibe"
          className="block text-sm font-medium text-gray-700"
        >
          What kind of vibe are you looking for?
        </label>
        <input
          type="text"
          id="vibe"
          placeholder="e.g., Historic pubs near landmarks"
          {...register('vibe')}
          className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${
            errors.vibe
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        {errors.vibe && (
          <p className="text-sm text-red-600">{errors.vibe.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Where are you starting from?
        </label>
        <AsyncLocationSearch
          register={register}
          setValue={setValue}
          name="location"
          errors={errors.location}
        />
        {errors.location && (
          <p className="text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        <span>Find Places</span>
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};
