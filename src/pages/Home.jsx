export default function Home({ go }) {
  return (
    <div data-screen-label="Home">
          <div style={{position: "relative", height: "92vh", minHeight: "700px", background: "#04301f", overflow: "hidden"}}>
            <img src="/assets/br-falls-aerial.jpg" alt="Victoria Falls from the air" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
            <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.55) 0%, rgba(4,48,31,0.1) 35%, rgba(4,48,31,0.82) 78%, rgba(4,48,31,0.96) 100%)"}}></div>
            <div style={{position: "absolute", inset: "0", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 0 100px", maxWidth: "1400px", margin: "0 auto", left: "0", right: "0"}}>
              <div style={{padding: "0 48px"}}>
                <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Victoria Falls · Zimbabwe</div>
                <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "92px", lineHeight: "1.02", color: "#faf3e8", margin: "20px 0 0", maxWidth: "15ch", textWrap: "pretty"}}>Africa is not a trip. It is a <em style={{color: "#b3955c"}}>feeling.</em></h1>
                <p style={{margin: "26px 0 0", maxWidth: "58ch", fontWeight: "300", fontSize: "19px", lineHeight: "1.85", color: "rgba(250,243,232,0.9)"}}>We begin where the earth roars — and we do not stop there. Tunyafrika crafts journeys that start at Victoria Falls and unfold across the continent.</p>
                <div className="stack-m" style={{display: "flex", alignItems: "center", gap: "18px", marginTop: "38px"}}>
                  <a className="x12" href="https://www.tunya.africa" target="_blank" rel="noopener" style={{background: "#b3955c", color: "#04301f", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>Start Planning</a>
                  <div className="x2" onClick={() => go("falls")} style={{cursor: "pointer", border: "1px solid rgba(250,243,232,0.5)", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "500", letterSpacing: "0.2em", textTransform: "uppercase"}}>See Victoria Falls</div>
                </div>
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "110px 48px 0", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "90px", alignItems: "start"}}>
            <div>
              <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>The Tunyafrika Way</div>
              <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "54px", lineHeight: "1.1", margin: "18px 0 0"}}>Born here. <em style={{color: "#b3955c"}}>Very African.</em></h2>
            </div>
            <div>
              <p style={{margin: "0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9"}}>Every Tunyafrika journey is built by people who grew up within earshot of the thunder. We know which guide tells the best stories, which lodge has the quiet deck, which morning the light on the gorge is worth waking for.</p>
              <p style={{margin: "20px 0 0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9"}}>You bring the dates. We handle borders, bookings, transfers, tables and the small courtesies that turn a holiday into a memory.</p>
              <div className="stats-grid" style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px", marginTop: "46px"}}>
                <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", color: "#04301f"}}>100%</div>
                  <div style={{fontSize: "13px", fontWeight: "300", lineHeight: "1.7", color: "rgba(13,43,30,0.72)", marginTop: "4px"}}>Locally owned and locally guided.</div>
                </div>
                <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", color: "#04301f"}}>24/7</div>
                  <div style={{fontSize: "13px", fontWeight: "300", lineHeight: "1.7", color: "rgba(13,43,30,0.72)", marginTop: "4px"}}>Tunya answers, day or night.</div>
                </div>
                <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", color: "#04301f"}}>3</div>
                  <div style={{fontSize: "13px", fontWeight: "300", lineHeight: "1.7", color: "rgba(13,43,30,0.72)", marginTop: "4px"}}>Countries within an hour of your hotel.</div>
                </div>
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "110px 48px 0"}}>
            <div className="stack-m" style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "40px"}}>
              <div>
                <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Where it begins</div>
                <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "54px", lineHeight: "1.1", margin: "18px 0 0"}}>Four days that rearrange you.</h2>
              </div>
              <div className="x3" onClick={() => go("xp")} style={{cursor: "pointer", fontSize: "12px", fontWeight: "500", letterSpacing: "0.22em", textTransform: "uppercase", color: "#04301f", borderBottom: "1px solid #b3955c", paddingBottom: "6px", whiteSpace: "nowrap"}}>All Xperiences →</div>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginTop: "48px"}}>
              <div onClick={() => go("falls")} style={{cursor: "pointer", position: "relative", height: "480px", overflow: "hidden", background: "#04301f"}}>
                <img src="/assets/br-explore-rainbow.jpg" alt="The rainforest trail" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.06) 40%, rgba(4,48,31,0.92) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", right: "26px", bottom: "26px", color: "#faf3e8"}}>
                  <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b3955c"}}>Day One</div>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", lineHeight: "1.15", marginTop: "6px"}}>Walk into the thunder</div>
                </div>
              </div>
              <div onClick={() => go("xp")} style={{cursor: "pointer", position: "relative", height: "480px", overflow: "hidden", background: "#04301f"}}>
                <img src="/assets/br-explore-flight.jpg" alt="Flight of Angels" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.06) 40%, rgba(4,48,31,0.92) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", right: "26px", bottom: "26px", color: "#faf3e8"}}>
                  <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b3955c"}}>Day Two</div>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", lineHeight: "1.15", marginTop: "6px"}}>See it from the sky</div>
                </div>
              </div>
              <div onClick={() => go("beyond")} style={{cursor: "pointer", position: "relative", height: "480px", overflow: "hidden", background: "#04301f"}}>
                <img src="/assets/ch-eleph-portrait.jpg" alt="Chobe elephants" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.06) 40%, rgba(4,48,31,0.92) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", right: "26px", bottom: "26px", color: "#faf3e8"}}>
                  <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b3955c"}}>Day Three</div>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", lineHeight: "1.15", marginTop: "6px"}}>Cross into Botswana</div>
                </div>
              </div>
              <div onClick={() => go("xp")} style={{cursor: "pointer", position: "relative", height: "480px", overflow: "hidden", background: "#04301f"}}>
                <img src="/assets/br-boma-drummer.jpg" alt="The Boma dinner" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.06) 40%, rgba(4,48,31,0.92) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", right: "26px", bottom: "26px", color: "#faf3e8"}}>
                  <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b3955c"}}>Day Four</div>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", lineHeight: "1.15", marginTop: "6px"}}>Eat by firelight</div>
                </div>
              </div>
            </div>
          </div>
    
          <div style={{marginTop: "120px", background: "#04301f", color: "#faf3e8"}}>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "110px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center"}}>
              <div style={{position: "relative"}}>
                <img src="/assets/br-tunya-site.jpg" alt="Tunya, the conversational travel assistant" style={{width: "100%", height: "520px", objectFit: "cover", display: "block"}} />
                <div className="deco-frame" style={{position: "absolute", top: "-16px", left: "-16px", right: "16px", bottom: "16px", border: "1px solid rgba(179,149,92,0.6)", pointerEvents: "none"}}></div>
              </div>
              <div>
                <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Meet Tunya</div>
                <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "56px", lineHeight: "1.08", margin: "18px 0 0"}}>Africa's first conversational travel assistant.</h2>
                <p style={{margin: "22px 0 0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9", color: "rgba(250,243,232,0.9)"}}>Ask a question, book a room, move a transfer, add a bungee at two in the morning. Tunya knows every lodge, every activity, every border rule — and never sleeps.</p>
                <a className="x12" href="https://www.tunya.africa" target="_blank" rel="noopener" style={{display: "inline-flex", alignItems: "center", gap: "12px", marginTop: "34px", background: "#b3955c", color: "#04301f", padding: "17px 32px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>Talk to Tunya</a>
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "110px 48px"}}>
            <div style={{textAlign: "center"}}>
              <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Beyond the Falls</div>
              <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "54px", lineHeight: "1.1", margin: "18px auto 0", maxWidth: "18ch"}}>The Falls are the door. Africa is the house.</h2>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "52px"}}>
              <div onClick={() => go("beyond")} style={{cursor: "pointer", position: "relative", height: "400px", overflow: "hidden"}}>
                <img src="/assets/w-capetown.jpg" alt="Cape Town" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.05) 45%, rgba(4,48,31,0.9) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", bottom: "24px", color: "#faf3e8", fontFamily: "'Cormorant Garamond', serif", fontSize: "32px"}}>Cape Town</div>
              </div>
              <div onClick={() => go("beyond")} style={{cursor: "pointer", position: "relative", height: "400px", overflow: "hidden"}}>
                <img src="/assets/w-lions.jpg" alt="The great plains" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.05) 45%, rgba(4,48,31,0.9) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", bottom: "24px", color: "#faf3e8", fontFamily: "'Cormorant Garamond', serif", fontSize: "32px"}}>The Great Plains</div>
              </div>
              <div onClick={() => go("beyond")} style={{cursor: "pointer", position: "relative", height: "400px", overflow: "hidden"}}>
                <img src="/assets/w-island.jpg" alt="Namibia" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.05) 45%, rgba(4,48,31,0.9) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", bottom: "24px", color: "#faf3e8", fontFamily: "'Cormorant Garamond', serif", fontSize: "32px"}}>Namibia</div>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "center", marginTop: "44px"}}>
              <div className="x4" onClick={() => go("beyond")} style={{cursor: "pointer", border: "1px solid #04301f", color: "#04301f", padding: "17px 34px", fontSize: "13px", fontWeight: "500", letterSpacing: "0.2em", textTransform: "uppercase"}}>Explore the Continent</div>
            </div>
          </div>
        </div>
  );
}
