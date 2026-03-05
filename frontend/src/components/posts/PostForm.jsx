/**
 * PostForm.jsx
 * Week 3: core form (title, description, images)
 * Week 4: category selector
 * Week 5: dynamic category-specific fields
 */
import { useState, useRef } from 'react';
import Input, { Textarea, Select } from '../common/Input';
import Button from '../common/Button';
import {
  CATEGORIES, HOUSING_TYPES, JOB_TYPES,
  COMMUNITY_SUB_CATEGORIES, CONDITIONS,
} from '../../utils/constants';
import toast from 'react-hot-toast';

// ── Week 5: Housing-specific fields ───────────────────────────
function HousingFields({ values, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-blue-400 flex items-center gap-2">🏠 Housing Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Property Type" value={values['housing.type'] || ''} onChange={e => onChange('housing.type', e.target.value)}>
          <option value="">Select type</option>
          {HOUSING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Input label="Monthly Rent ($)" type="number" min="0" placeholder="1200"
          value={values['housing.rent'] || ''} onChange={e => onChange('housing.rent', e.target.value)} />
        <Input label="Security Deposit ($)" type="number" min="0" placeholder="1200"
          value={values['housing.deposit'] || ''} onChange={e => onChange('housing.deposit', e.target.value)} />
        <Input label="Bedrooms" type="number" min="0" max="20"
          value={values['housing.bedrooms'] || ''} onChange={e => onChange('housing.bedrooms', e.target.value)} />
        <Input label="Bathrooms" type="number" min="0" max="10"
          value={values['housing.bathrooms'] || ''} onChange={e => onChange('housing.bathrooms', e.target.value)} />
        <Input label="Available From" type="date"
          value={values['housing.availableFrom'] || ''} onChange={e => onChange('housing.availableFrom', e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-4">
        {[
          ['housing.utilities',  'Utilities Included'],
          ['housing.petFriendly','Pet Friendly'],
          ['housing.furnished',  'Furnished'],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-sky-500"
              checked={values[key] === 'true' || values[key] === true}
              onChange={e => onChange(key, e.target.checked ? 'true' : 'false')} />
            <span className="text-sm text-gray-300">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ── Week 5: Ride-specific fields ───────────────────────────────
function RidesFields({ values, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-emerald-400 flex items-center gap-2">🚗 Ride Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="From *" placeholder="City / Location" required
          value={values['rides.from'] || ''} onChange={e => onChange('rides.from', e.target.value)} />
        <Input label="To *" placeholder="Destination" required
          value={values['rides.to'] || ''} onChange={e => onChange('rides.to', e.target.value)} />
        <Input label="Departure Date" type="date"
          value={values['rides.departureDate'] || ''} onChange={e => onChange('rides.departureDate', e.target.value)} />
        <Input label="Departure Time" type="time"
          value={values['rides.departureTime'] || ''} onChange={e => onChange('rides.departureTime', e.target.value)} />
        <Input label="Seats Available" type="number" min="1" max="8"
          value={values['rides.seats'] || ''} onChange={e => onChange('rides.seats', e.target.value)} />
        <Input label="Cost per Person ($)" type="number" min="0"
          value={values['rides.costPerPerson'] || ''} onChange={e => onChange('rides.costPerPerson', e.target.value)} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-sky-500"
          checked={values['rides.recurring'] === 'true' || values['rides.recurring'] === true}
          onChange={e => onChange('rides.recurring', e.target.checked ? 'true' : 'false')} />
        <span className="text-sm text-gray-300">Recurring weekly ride</span>
      </label>
    </div>
  );
}

// ── Week 5: Job-specific fields ────────────────────────────────
function JobsFields({ values, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-amber-400 flex items-center gap-2">💼 Job Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Job Type" value={values['jobs.jobType'] || ''} onChange={e => onChange('jobs.jobType', e.target.value)}>
          <option value="">Select type</option>
          {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Input label="Hours per Week" type="number" min="1" max="60"
          value={values['jobs.hoursPerWeek'] || ''} onChange={e => onChange('jobs.hoursPerWeek', e.target.value)} />
        <Input label="Pay Rate ($/hr)" type="number" min="0"
          value={values['jobs.payRate'] || ''} onChange={e => onChange('jobs.payRate', e.target.value)} />
        <Input label="Application Deadline" type="date"
          value={values['jobs.deadline'] || ''} onChange={e => onChange('jobs.deadline', e.target.value)} />
        <div className="sm:col-span-2">
          <Input label="Required Skills (comma-separated)" placeholder="Python, Excel, Customer Service"
            value={values['jobs.requiredSkills'] || ''} onChange={e => onChange('jobs.requiredSkills', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Input label="Application URL" type="url" placeholder="https://..."
            value={values['jobs.applicationUrl'] || ''} onChange={e => onChange('jobs.applicationUrl', e.target.value)} />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-sky-500"
          checked={values['jobs.workAuthRequired'] === 'true' || values['jobs.workAuthRequired'] === true}
          onChange={e => onChange('jobs.workAuthRequired', e.target.checked ? 'true' : 'false')} />
        <span className="text-sm text-gray-300">Work authorization required (no F-1/OPT)</span>
      </label>
    </div>
  );
}

// ── Week 5: Community-specific fields ─────────────────────────
function CommunityFields({ values, onChange }) {
  const sub = values['community.subCategory'];
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-purple-400 flex items-center gap-2">📝 Post Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Sub-Category" value={sub || ''} onChange={e => onChange('community.subCategory', e.target.value)}>
          <option value="">Select sub-category</option>
          {COMMUNITY_SUB_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        {(sub === 'Buy/Sell' || sub === '') && (
          <Input label="Price ($)" type="number" min="0" placeholder="0 = free"
            value={values['community.price'] || ''} onChange={e => onChange('community.price', e.target.value)} />
        )}
        {sub === 'Events' && (
          <Input label="Event Date & Time" type="datetime-local"
            value={values['community.eventDate'] || ''} onChange={e => onChange('community.eventDate', e.target.value)} />
        )}
        {sub === 'Buy/Sell' && (
          <Select label="Item Condition" value={values['community.condition'] || ''} onChange={e => onChange('community.condition', e.target.value)}>
            <option value="">Select condition</option>
            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        )}
      </div>
      {sub === 'Buy/Sell' && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-sky-500"
            checked={values['community.negotiable'] === 'true' || values['community.negotiable'] === true}
            onChange={e => onChange('community.negotiable', e.target.checked ? 'true' : 'false')} />
          <span className="text-sm text-gray-300">Price is negotiable</span>
        </label>
      )}
    </div>
  );
}

// ── Main PostForm ──────────────────────────────────────────────
export default function PostForm({ initialData, onSubmit, submitting }) {
  const [category,    setCategory]    = useState(initialData?.category || 'housing');
  const [title,       setTitle]       = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [location,    setLocation]    = useState(initialData?.location || '');
  const [catFields,   setCatFields]   = useState({});      // category-specific flat fields
  const [images,      setImages]      = useState([]);       // new File objects
  const [previews,    setPreviews]    = useState(          // preview URLs
    initialData?.images?.map(i => i.url) || []
  );
  const [dragOver,    setDragOver]    = useState(false);
  const fileInputRef = useRef();

  const updateCatField = (key, value) => {
    setCatFields(prev => ({ ...prev, [key]: value }));
  };

  const handleImageFiles = (files) => {
    const valid = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, 5);

    if (valid.length < files.length) toast('Only image files accepted');
    setImages(valid);
    setPreviews(valid.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim())       { toast.error('Title is required'); return; }
    if (!description.trim()) { toast.error('Description is required'); return; }

    // Week 5: validate category-specific required fields
    if (category === 'rides') {
      if (!catFields['rides.from'] || !catFields['rides.to']) {
        toast.error('Ride requires From and To locations');
        return;
      }
    }

    const formData = new FormData();
    formData.append('title',       title);
    formData.append('description', description);
    formData.append('category',    category);
    formData.append('location',    location);

    // Append category-specific flat fields
    Object.entries(catFields).forEach(([key, val]) => {
      formData.append(key, val);
    });

    // Images
    images.forEach(img => formData.append('images', img));

    await onSubmit(formData);
  };

  const catConfig = CATEGORIES.find(c => c.id === category);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── Category selector (Week 4) ── */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Category *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <button key={cat.id} type="button"
              onClick={() => { setCategory(cat.id); setCatFields({}); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-medium
                text-sm transition-all ${category === cat.id
                  ? `${cat.bg} ${cat.text} ${cat.border.replace('20', '60')}`
                  : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Core fields (Week 3) ── */}
      <Input label="Title" required maxLength={150} placeholder={
        category === 'housing' ? 'e.g. Cozy studio near campus, available Feb 1' :
        category === 'rides'   ? 'e.g. Ride to NYC this Friday, splitting costs' :
        category === 'jobs'    ? 'e.g. Part-time cashier at campus bookstore' :
        'e.g. Selling calculus textbook, great condition'
      } value={title} onChange={e => setTitle(e.target.value)} />

      <Textarea label="Description" required rows={5} maxLength={3000}
        placeholder="Add all important details — the more info the better!"
        value={description} onChange={e => setDescription(e.target.value)} />

      <Input label="Location" placeholder="e.g. Near University Ave, City" maxLength={200}
        value={location} onChange={e => setLocation(e.target.value)} />

      {/* ── Category-specific fields (Week 5) ── */}
      <div className={`rounded-2xl border p-6 ${catConfig.bg} ${catConfig.border}`}>
        {category === 'housing'   && <HousingFields   values={catFields} onChange={updateCatField} />}
        {category === 'rides'     && <RidesFields     values={catFields} onChange={updateCatField} />}
        {category === 'jobs'      && <JobsFields      values={catFields} onChange={updateCatField} />}
        {category === 'community' && <CommunityFields values={catFields} onChange={updateCatField} />}
      </div>

      {/* ── Image upload (Week 4) ── */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">Photos (up to 5)</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleImageFiles(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
            ${dragOver
              ? 'border-sky-500 bg-sky-500/10'
              : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/30'
            }`}
        >
          <div className="text-4xl mb-2">📷</div>
          <p className="text-gray-400 font-medium">Drop images here or <span className="text-sky-400 underline">browse</span></p>
          <p className="text-xs text-gray-600 mt-1">JPG, PNG, WebP — max 5MB each — up to 5 photos</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => handleImageFiles(e.target.files)} />

        {previews.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} alt={`Preview ${i+1}`}
                  className="h-20 w-28 object-cover rounded-xl border-2 border-gray-700" />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs bg-sky-600 text-white px-1.5 py-0.5 rounded-md font-semibold">Cover</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" size="lg" loading={submitting} className="w-full">
        {initialData ? '💾 Save Changes' : '🚀 Publish Post'}
      </Button>
    </form>
  );
}
