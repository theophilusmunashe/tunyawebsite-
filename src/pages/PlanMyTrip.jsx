export default function PlanMyTrip({ go }) {
  return (
    <div data-screen-label="Plan My Trip">
          <div style={{position: "relative", height: "56vh", minHeight: "440px", background: "#04301f", overflow: "hidden"}}>
            <img src="/assets/br-promise-crew.jpg" alt="The Tunyafrika team" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
            <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.5) 0%, rgba(4,48,31,0.15) 40%, rgba(4,48,31,0.92) 85%, rgba(4,48,31,0.98) 100%)"}}></div>
            <div style={{position: "absolute", left: "0", right: "0", bottom: "64px", maxWidth: "1400px", margin: "0 auto", padding: "0 48px"}}>
              <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Plan my trip</div>
              <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "72px", lineHeight: "1.06", color: "#faf3e8", margin: "16px 0 0", maxWidth: "18ch"}}>Tell us when. We'll take it from there.</h1>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 0", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "80px"}}>
            <div>
              <div style={{display: "grid", gap: "26px"}}>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px"}}>
                  <div>
                    <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(13,43,30,0.6)"}}>Your name</div>
                    <input className="x8" type="text" placeholder="Jane Moyo" style={{width: "100%", boxSizing: "border-box", marginTop: "8px", padding: "14px 0", border: "none", borderBottom: "1px solid rgba(13,43,30,0.25)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: "300", color: "#0d2b1e", outline: "none"}} />
                  </div>
                  <div>
                    <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(13,43,30,0.6)"}}>Email</div>
                    <input className="x8" type="email" placeholder="jane@email.com" style={{width: "100%", boxSizing: "border-box", marginTop: "8px", padding: "14px 0", border: "none", borderBottom: "1px solid rgba(13,43,30,0.25)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: "300", color: "#0d2b1e", outline: "none"}} />
                  </div>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px"}}>
                  <div>
                    <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(13,43,30,0.6)"}}>When</div>
                    <input className="x8" type="text" placeholder="Late September, 6 nights" style={{width: "100%", boxSizing: "border-box", marginTop: "8px", padding: "14px 0", border: "none", borderBottom: "1px solid rgba(13,43,30,0.25)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: "300", color: "#0d2b1e", outline: "none"}} />
                  </div>
                  <div>
                    <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(13,43,30,0.6)"}}>Travelling as</div>
                    <input className="x8" type="text" placeholder="Two adults, one child" style={{width: "100%", boxSizing: "border-box", marginTop: "8px", padding: "14px 0", border: "none", borderBottom: "1px solid rgba(13,43,30,0.25)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: "300", color: "#0d2b1e", outline: "none"}} />
                  </div>
                </div>
                <div>
                  <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(13,43,30,0.6)"}}>What kind of trip</div>
                  <div style={{display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px"}}>
                    <div className="x2" style={{cursor: "pointer", border: "1px solid rgba(13,43,30,0.25)", padding: "10px 20px", fontSize: "14px", fontWeight: "300"}}>The Falls</div>
                    <div className="x2" style={{cursor: "pointer", border: "1px solid rgba(13,43,30,0.25)", padding: "10px 20px", fontSize: "14px", fontWeight: "300"}}>Safari</div>
                    <div className="x2" style={{cursor: "pointer", border: "1px solid rgba(13,43,30,0.25)", padding: "10px 20px", fontSize: "14px", fontWeight: "300"}}>Adrenaline</div>
                    <div className="x2" style={{cursor: "pointer", border: "1px solid rgba(13,43,30,0.25)", padding: "10px 20px", fontSize: "14px", fontWeight: "300"}}>Honeymoon</div>
                    <div className="x2" style={{cursor: "pointer", border: "1px solid rgba(13,43,30,0.25)", padding: "10px 20px", fontSize: "14px", fontWeight: "300"}}>Family</div>
                    <div className="x2" style={{cursor: "pointer", border: "1px solid rgba(13,43,30,0.25)", padding: "10px 20px", fontSize: "14px", fontWeight: "300"}}>Beyond the Falls</div>
                  </div>
                </div>
                <div>
                  <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(13,43,30,0.6)"}}>Anything we should know</div>
                  <textarea className="x9" rows="4" placeholder="It's our anniversary. One of us is terrified of heights." style={{width: "100%", boxSizing: "border-box", marginTop: "8px", padding: "14px", border: "1px solid rgba(13,43,30,0.25)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: "300", color: "#0d2b1e", outline: "none", resize: "vertical"}}></textarea>
                </div>
                <div className="stack-m" style={{display: "flex", alignItems: "center", gap: "20px", marginTop: "6px"}}>
                  <div className="x5" style={{cursor: "pointer", background: "#04301f", color: "#faf3e8", padding: "18px 36px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase"}}>Send My Enquiry</div>
                  <div style={{fontSize: "14px", fontWeight: "300", color: "rgba(13,43,30,0.7)"}}>Or ask Tunya instantly at <span style={{color: "#b3955c"}}>www.tunya.africa</span></div>
                </div>
              </div>
            </div>
    
            <div style={{background: "#04301f", color: "#faf3e8", padding: "46px 44px", alignSelf: "start"}}>
              <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.38em", textTransform: "uppercase", color: "#b3955c"}}>Talk to a human</div>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "38px", lineHeight: "1.15", marginTop: "14px"}}>We answer fast — usually within the hour.</div>
              <div style={{display: "grid", gap: "20px", marginTop: "34px"}}>
                <div style={{borderTop: "1px solid rgba(179,149,92,0.5)", paddingTop: "14px"}}>
                  <div style={{fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(250,243,232,0.6)"}}>WhatsApp</div>
                  <div style={{fontSize: "19px", fontWeight: "300", marginTop: "4px"}}>+263 78 266 9251</div>
                </div>
                <div style={{borderTop: "1px solid rgba(179,149,92,0.5)", paddingTop: "14px"}}>
                  <div style={{fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(250,243,232,0.6)"}}>Email</div>
                  <div style={{fontSize: "19px", fontWeight: "300", marginTop: "4px"}}>enquiries@tunyafrika.com</div>
                </div>
                <div style={{borderTop: "1px solid rgba(179,149,92,0.5)", paddingTop: "14px"}}>
                  <div style={{fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(250,243,232,0.6)"}}>Office</div>
                  <div style={{fontSize: "19px", fontWeight: "300", marginTop: "4px", lineHeight: "1.6"}}>619 Ngugwuma Road<br />Victoria Falls, Zimbabwe</div>
                </div>
              </div>
            </div>
          </div>
    
          <div style={{height: "110px"}}></div>
        </div>
  );
}
