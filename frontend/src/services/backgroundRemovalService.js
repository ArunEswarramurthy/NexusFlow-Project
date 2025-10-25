const removeBackgroundAPI = async (imageFile) => {
  const formData = new FormData();
  formData.append('image_file', imageFile);
  
  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REACT_APP_REMOVEBG_API_KEY,
      },
      body: formData,
    });
    
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    throw new Error('Background removal failed');
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export { removeBackgroundAPI };