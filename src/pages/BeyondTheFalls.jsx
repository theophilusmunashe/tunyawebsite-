export default function BeyondTheFalls({ go }) {
  return (
    <div data-screen-label="Beyond the Falls">
          <div style={{background: "#04301f", color: "#faf3e8"}}>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 90px", display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: "70px", alignItems: "end"}}>
              <div>
                <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Beyond the Falls</div>
                <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "78px", lineHeight: "1.05", margin: "18px 0 0", maxWidth: "16ch"}}>One continent. Many thunders.</h1>
              </div>
              <p style={{margin: "0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9", color: "rgba(250,243,232,0.9)"}}>Victoria Falls is where we begin — because it is where Africa announces itself. From there we take you onward: to elephants at a Botswana river, to a mountain above a harbour, to dunes at first light, to an ocean the colour of glass.</p>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 0", display: "grid", gap: "20px"}}>
            <div className="feature-banner" style={{position: "relative", height: "520px", overflow: "hidden"}}>
              <img src="/assets/ch-eleph-portrait.jpg" alt="Chobe, Botswana" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 58%"}} />
              <div style={{position: "absolute", inset: "0", background: "linear-gradient(90deg, rgba(4,48,31,0.9) 0%, rgba(4,48,31,0.55) 42%, rgba(4,48,31,0.15) 100%)"}}></div>
              <div className="overlay-panel" style={{position: "absolute", left: "44px", top: "0", bottom: "0", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "46%", color: "#faf3e8"}}>
                <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.32em", textTransform: "uppercase", color: "#b3955c"}}>Botswana · one border away</div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "52px", lineHeight: "1.08", marginTop: "10px"}}>Chobe National Park</div>
                <div style={{fontSize: "17px", fontWeight: "300", lineHeight: "1.8", marginTop: "12px", color: "rgba(250,243,232,0.9)"}}>Africa's largest elephant population, a riverfront game drive and a boat cruise — all inside a single day from your Victoria Falls hotel.</div>
              </div>
            </div>
    
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
              <div style={{position: "relative", height: "460px", overflow: "hidden"}}>
                <img src="/assets/w-capetown.jpg" alt="Cape Town" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.1) 40%, rgba(4,48,31,0.93) 100%)"}}></div>
                <div style={{position: "absolute", left: "32px", right: "32px", bottom: "30px", color: "#faf3e8"}}>
                  <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.32em", textTransform: "uppercase", color: "#b3955c"}}>South Africa</div>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", lineHeight: "1.1", marginTop: "6px"}}>Cape Town</div>
                  <div style={{fontSize: "16px", fontWeight: "300", marginTop: "8px", color: "rgba(250,243,232,0.88)"}}>A mountain, two oceans and the best table in Africa.</div>
                </div>
              </div>
              <div style={{position: "relative", height: "460px", overflow: "hidden"}}>
                <img src="/assets/w-lions.jpg" alt="The great plains" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.1) 40%, rgba(4,48,31,0.93) 100%)"}}></div>
                <div style={{position: "absolute", left: "32px", right: "32px", bottom: "30px", color: "#faf3e8"}}>
                  <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.32em", textTransform: "uppercase", color: "#b3955c"}}>Kenya &amp; Tanzania</div>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", lineHeight: "1.1", marginTop: "6px"}}>The Great Plains</div>
                  <div style={{fontSize: "16px", fontWeight: "300", marginTop: "8px", color: "rgba(250,243,232,0.88)"}}>Prides, migrations and horizons with nothing on them.</div>
                </div>
              </div>
            </div>
    
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px"}}>
              <div style={{position: "relative", height: "420px", overflow: "hidden"}}>
                <img src="/assets/w-island.jpg" alt="Indian Ocean islands" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.08) 45%, rgba(4,48,31,0.93) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", right: "26px", bottom: "26px", color: "#faf3e8"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", lineHeight: "1.1"}}>Indian Ocean</div>
                  <div style={{fontSize: "15px", fontWeight: "300", marginTop: "6px", color: "rgba(250,243,232,0.88)"}}>The soft week after the wild one.</div>
                </div>
              </div>
              <div style={{position: "relative", height: "420px", overflow: "hidden"}}>
                <img src="/assets/w-desert.jpg" alt="Desert dunes" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.08) 45%, rgba(4,48,31,0.93) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", right: "26px", bottom: "26px", color: "#faf3e8"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", lineHeight: "1.1"}}>The Dunes</div>
                  <div style={{fontSize: "15px", fontWeight: "300", marginTop: "6px", color: "rgba(250,243,232,0.88)"}}>Silence, scale and light you can taste.</div>
                </div>
              </div>
              <div style={{position: "relative", height: "420px", overflow: "hidden"}}>
                <img src="/assets/w-marrakech.jpg" alt="North African riad" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.08) 45%, rgba(4,48,31,0.93) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", right: "26px", bottom: "26px", color: "#faf3e8"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", lineHeight: "1.1"}}>The North</div>
                  <div style={{fontSize: "15px", fontWeight: "300", marginTop: "6px", color: "rgba(250,243,232,0.88)"}}>Courtyards, spice markets and tiled quiet.</div>
                </div>
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 110px", textAlign: "center"}}>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "52px", lineHeight: "1.1", margin: "0 auto", maxWidth: "22ch"}}>Start at the Falls. Finish wherever you like.</h2>
            <div style={{display: "flex", justifyContent: "center", marginTop: "34px"}}>
              <a className="x6" href="https://www.tunya.africa" target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>Design My Journey</a>
            </div>
          </div>
        </div>
  );
}
