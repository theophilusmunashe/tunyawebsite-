export default function VictoriaFalls({ go }) {
  return (
    <div data-screen-label="Victoria Falls">
          <div style={{position: "relative", height: "78vh", minHeight: "620px", background: "#04301f", overflow: "hidden"}}>
            <img src="/assets/br-falls-aerial2.jpg" alt="Mosi-oa-Tunya" style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
            <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.5) 0%, rgba(4,48,31,0.08) 38%, rgba(4,48,31,0.86) 80%, rgba(4,48,31,0.97) 100%)"}}></div>
            <div style={{position: "absolute", left: "0", right: "0", bottom: "84px", maxWidth: "1400px", margin: "0 auto", padding: "0 48px"}}>
              <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Mosi-oa-Tunya · The Smoke That Thunders</div>
              <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "80px", lineHeight: "1.05", color: "#faf3e8", margin: "18px 0 0", maxWidth: "16ch"}}>A mile of falling water, and a sound you feel first.</h1>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 0", display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "80px"}}>
            <div>
              <p style={{margin: "0", fontWeight: "300", fontSize: "20px", lineHeight: "1.9"}}>One of the Seven Natural Wonders of the World. 1,708 metres wide, 108 metres tall, and loud enough to hear before you see it. The spray climbs half a kilometre into the sky and can be seen from fifty kilometres away.</p>
              <p style={{margin: "20px 0 0", fontWeight: "300", fontSize: "20px", lineHeight: "1.9"}}>You can walk its rainforest in a raincoat, fly over it at dawn, stand on the bridge between two countries, or — in the low-water months — swim on its very lip.</p>
            </div>
            <div style={{display: "grid", gap: "22px", alignContent: "start"}}>
              <div className="split-line" style={{borderTop: "1px solid #b3955c", paddingTop: "14px", display: "flex", justifyContent: "space-between", gap: "24px"}}><span style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "24px"}}>February – May</span><span style={{fontSize: "15px", fontWeight: "300", color: "rgba(13,43,30,0.72)", textAlign: "right"}}>Peak flow. Full thunder, full spray.</span></div>
              <div className="split-line" style={{borderTop: "1px solid rgba(179,149,92,0.4)", paddingTop: "14px", display: "flex", justifyContent: "space-between", gap: "24px"}}><span style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "24px"}}>June – August</span><span style={{fontSize: "15px", fontWeight: "300", color: "rgba(13,43,30,0.72)", textAlign: "right"}}>Cool, clear. Best for safari and the bridge.</span></div>
              <div className="split-line" style={{borderTop: "1px solid rgba(179,149,92,0.4)", paddingTop: "14px", display: "flex", justifyContent: "space-between", gap: "24px"}}><span style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "24px"}}>September – December</span><span style={{fontSize: "15px", fontWeight: "300", color: "rgba(13,43,30,0.72)", textAlign: "right"}}>Low water. Devil's Pool opens.</span></div>
            </div>
          </div>
    
          <div className="photo-mosaic" style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 0", display: "grid", gridTemplateColumns: "1.4fr 1fr", gridTemplateRows: "300px 300px", gap: "20px"}}>
            <img src="/assets/br-explore-admire.jpg" alt="At the edge" style={{width: "100%", height: "100%", objectFit: "cover", gridRow: "1 / 3"}} />
            <img src="/assets/br-explore-bridge.jpg" alt="The 1905 bridge" style={{width: "100%", height: "100%", objectFit: "cover"}} />
            <img src="/assets/br-joy.jpg" alt="Joy at the falls" style={{width: "100%", height: "100%", objectFit: "cover"}} />
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 0"}}>
            <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>Know before you go</div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", marginTop: "34px"}}>
              <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "26px"}}>Your passport</div>
                <p style={{margin: "8px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.8", color: "rgba(13,43,30,0.78)"}}>Valid six months beyond travel, with two blank pages for the stamps you're about to collect.</p>
              </div>
              <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "26px"}}>The KAZA UniVisa</div>
                <p style={{margin: "8px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.8", color: "rgba(13,43,30,0.78)"}}>One visa, two countries — see the Falls from Zimbabwe and Zambia. We confirm eligibility for your passport.</p>
              </div>
              <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "26px"}}>You'll get wet</div>
                <p style={{margin: "8px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.8", color: "rgba(13,43,30,0.78)"}}>In high water the rainforest rains upward. Bring a raincoat and a dry bag for your phone.</p>
              </div>
              <div style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "26px"}}>No fences</div>
                <p style={{margin: "8px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.8", color: "rgba(13,43,30,0.78)"}}>Elephants cross the road, warthogs graze the lawns. Your safari begins at the airport.</p>
              </div>
            </div>
            <div className="stack-m" style={{display: "flex", alignItems: "center", gap: "18px", marginTop: "56px", paddingBottom: "110px"}}>
              <a className="x6" href="https://www.tunya.africa" target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>Plan My Falls Trip</a>
              <div className="x4" onClick={() => go("xp")} style={{cursor: "pointer", border: "1px solid #04301f", color: "#04301f", padding: "18px 34px", fontSize: "13px", fontWeight: "500", letterSpacing: "0.2em", textTransform: "uppercase"}}>What To Do Here</div>
            </div>
          </div>
        </div>
  );
}
