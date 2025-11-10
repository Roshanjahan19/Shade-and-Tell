import React, { useEffect, useState } from "react";
import "../CSS/wishlist.css";

const Wishlist = ({ userId, setActiveNav }) => {
  const [items, setItems] = useState([]);

  
  const [customName, setCustomName] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [customShade, setCustomShade] = useState("");

  useEffect(() => {
    if (!userId) {
      setActiveNav("login");
      return;
    }
    fetchWishlist();
  }, [userId]);

  const fetchWishlist = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${userId}`);
    const data = await res.json();
    setItems(data);
  };

  
  const addCustomItem = async () => {
    if (!customName.trim()) return;

    await fetch(`${import.meta.env.VITE_API_URL}/wishlist/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_name: customName,
        brand: customBrand || null,
        shade: customShade || null
      })
    });

    
    setCustomName("");
    setCustomBrand("");
    setCustomShade("");

    fetchWishlist();
  };

  const removeItem = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${id}`, {
      method: "DELETE"
    });

    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="routine-page">
      <h2 className="routine-title">My Wishlist ♡</h2>

      <div className="routine-box">
        <h3 className="routine-subtitle">Add an Item</h3>

        
        <input
          className="routine-input"
          placeholder="Product name..."
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
        />

        
        <input
          className="routine-input"
          placeholder="Brand (optional)"
          value={customBrand}
          onChange={(e) => setCustomBrand(e.target.value)}
        />

        
        <input
          className="routine-input"
          placeholder="Shade (optional)"
          value={customShade}
          onChange={(e) => setCustomShade(e.target.value)}
        />

        <button className="routine-btn" onClick={addCustomItem}>
          Add to Wishlist
        </button>
      </div>

      <div className="routine-section">
        <h3 className="routine-subtitle">Your Saved Products ₊ ⊹</h3>

        {items.length === 0 ? (
          <p className="routine-empty">Your wishlist is empty</p>
        ) : (
          <div className="wishlist-cards">
            {items.map((item) => (
              <div key={item.id} className="wishlist-card">
                
                
                {item.image_url ? (
  <img src={item.image_url} className="wishlist-img" />
) : (
  <div className="wishlist-img placeholder">♡</div>
)}

                <div className="wishlist-info">


  <p className="wishlist-name">
    <span className="wishlist-label">▪ Name:</span>{" "}
    {item.db_product_name || item.product_name}
  </p>

  
  {(item.db_shade || item.custom_shade) && (
    <p className="wishlist-shade">
      <span className="wishlist-label">▪ Shade:</span>{" "}
      {item.db_shade || item.custom_shade}
    </p>
  )}

  {(item.db_brand || item.custom_brand) && (
    <p className="wishlist-brand">
      <span className="wishlist-label">▪ Brand:</span>{" "}
      {item.db_brand || item.custom_brand}
    </p>
  )}

  
  {item.product_url && (
    <a href={item.product_url} target="_blank" className="wishlist-link">
      View Product
    </a>
  )}

</div>

                
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  ✖
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
