<?php get_header(); /* Template Name: Template Product Default */ ?>

<?php
  if (have_posts()) : while (have_posts()) : the_post();
  $url_svg = file_get_contents(get_template_directory_uri()."/img/product_overview-visInsight.svg");

?>
  <div class="block-product">
    <!-- Visinight -->
    <div class="block-visinight" id="product-visInsight">
      <!-- Banner -->
      <div class="block block-product-banner js-hero">
        <div class="holder-fluid banner-inner">
          <div class="img-wrap">
            <img class="img" src="<?= RESOURCE_HOST . '/img/product-insight-laptop.png' ?>" alt="">
          </div>
          <div class="content">
            <h2 class="ttl">VISInsight</h2>
            <div class="des">Is a project management tool of VietIS company, aiming to implement the digital transformation roadmap.</div>
            <ul class="product-insight-implement">
              <li class="item">
                <span class="number">1</span>
                <span class="txt">Planning assistance</span>
              </li>
              <li class="item">
                <span class="number">2</span>
                <span class="txt">Monitoring project</span>
              </li>
              <li class="item">
                <span class="number">3</span>
                <span class="txt">Data collection</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- END: Banner -->

      <!-- Technology -->
      <div class="block block-technology">
        <ul class="holder list">
          <li class="item">
            <img class="img" src="<?= RESOURCE_HOST . '/img/product_sass.png' ?>" alt="">
          </li>
          <li class="item">
            <img class="img" src="<?= RESOURCE_HOST . '/img/product_bootstrap.png' ?>" alt="">
          </li>
          <li class="item">
            <img class="img" src="<?= RESOURCE_HOST . '/img/product_sql.png' ?>" alt="">
          </li>
          <li class="item">
            <img class="img" src="<?= RESOURCE_HOST . '/img/product_net.png' ?>" alt="">
          </li>
          <li class="item">
            <img class="img" src="<?= RESOURCE_HOST . '/img/product_css3.png' ?>" alt="">
          </li>
          <li class="item">
            <img class="img" src="<?= RESOURCE_HOST . '/img/product_html5.png' ?>" alt="">
          </li>
          <li class="item">
            <img class="img" src="<?= RESOURCE_HOST . '/img/product_js.png' ?>" alt="">
          </li>
        </ul>
      </div>
      <!-- END: Technology -->

      <!-- Overview VISInsight -->
      <div class="block block-product-overview">
        <div class="holder">
          <div class="product-ttl">Overview VISInsight</div>
          <div class="block-product-overview-pc">
            <?= $url_svg ?>
          </div>

          <div class="block-product-overview-sp">
            <div class="img">
              <img class="img" src="<?= RESOURCE_HOST . '/img/product-insight-dt.png' ?>" alt="">
            </div>
            <ul class="list">
              <li class="item">
                <p class="ttl">BOD</p>
                <p class="txt">View project situation in the company<br>Review, approve necessary documents</p>
              </li>
              <li class="item">
                <p class="ttl">QA</p>
                <p class="txt">View, monitor project information<br>Support PM completes the target<br>Collect data analysis, build target for the organization</p>
              </li>
              <li class="item">
                <p class="ttl">Software production department</p>
                <p class="txt">Create procedures for opening and closing projects<br>Create a report<br>Monitoring<br>Resource Management</p>
              </li>
              <li class="item">
                <p class="ttl">IT Support</p>
                <p class="txt">Decentralization for the project<br>Backup/ recovery’s server folder</p>
              </li>
              <li class="item">
                <p class="ttl">HR</p>
                <p class="txt">Department information management<br>Employee information management</p>
              </li>
              <li class="item">
                <p class="ttl">Sales</p>
                <p class="txt">Create customer information<br>Bidding information management</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- END: Overview VISInsight -->

      <!-- Function list -->
      <div class="block block-functions">
        <div class="holder">
          <div class="wrapper">
            <h3 class="product-ttl">Function list</h3>
            <ul class="list">
              <li class="item"><p class="txt">Manager Project Bidding</p></li>
              <li class="item"><p class="txt">Weekly Report</p></li>
              <li class="item"><p class="txt">Project Opening (submit, review, approve)</p></li>
              <li class="item"><p class="txt">Resource Reports</p></li>
              <li class="item"><p class="txt">Redmine members Synchronize</p></li>
              <li class="item"><p class="txt">OT Registration</p></li>
              <li class="item"><p class="txt">Estimation Importing</p></li>
              <li class="item"><p class="txt">Members Management</p></li>
              <li class="item"><p class="txt">Requirements Importing</p></li>
              <li class="item"><p class="txt">Departments Management</p></li>
              <li class="item"><p class="txt">Requirements Synchronization</p></li>
              <li class="item"><p class="txt">Project Opening Decision</p></li>
            </ul>
          </div>
        </div>
      </div>
      <!-- END: Function list -->
    </div>
    <!-- END: Visinight -->

    <!-- Veramine -->
    <div class="block block-veramine" id="product-veramine">
      <div class="banner">
        <div class="holder">
          <div class="header">
            <div class="logo">
              <img src="<?= RESOURCE_HOST ?>/img/veramine/logo_veramin.svg" alt=""/>
            </div>
            <p class="header-txt">アメリカ国防総省、空軍、国土安全保障省なとて導入済み!</p>
          </div>

          <div class="content">
            <div class="desc">
              <h2 class="ttl">テレワークのデバイス環<br>境をセキュアに保つ</h2>
              <div class="txt">従来のセキュリティ対策ソフトでは対応できないサイバー攻撃を阻止!</div>
            </div>
            <div class="img">
              <img src="<?= RESOURCE_HOST ?>/img/veramine/icon_baner_veramin.svg" alt=""/>
            </div>
          </div>

          <ul class="list">
            <li class="item">クラウドとオンプレミス いすれにも対応</li>
            <li class="item">強力なすべての機能を 1つのセンサーに バッケージ化</li>
            <li class="item">CPU 1 % 20M3 AMで負荷がかからない</li>
          </ul>
        </div>
      </div><!-- /banner -->

      <div class="option">
        <div class="holder">
          <div class="list">
            <div class="item">
              <div class="header">
                <div class="img">
                <img src="<?= RESOURCE_HOST ?>/img/veramine/feature01.svg" alt=""/>
                </div>
                <p class="ttl">高精度<br>アルゴリズム</p>
              </div>
              <div class="main">
                <p class="desc">膨大なデータをあらゆる角度から深く分析、サイバー攻撃の兆候をリアルタイムに検知・可視化し、標的型攻撃などの高度なサイバー攻撃を阻止します。</p>
                <p class="note">Veramine Endpoint Detection日れdRes 0れse (VEDR)</p>
              </div>
            </div>
            <div class="item">
              <div class="header">
                <div class="img">
                <img src="<?= RESOURCE_HOST ?>/img/veramine/feature03.svg" alt=""/>
                </div>
                <p class="ttl">全てのエンドボイントをリアルタイムに監視</p>
              </div>
              <div class="main">
                <p class="desc">企業が保有する数多くのエンドボイントに対し、マルウェアの感染や攻撃を検知し、影響範囲を特定、早期対応を実現します。</p>
                <p class="note">Veramine P′Odu( ⅵ MOれ0 ng r00 (VPMT)</p>
              </div>
            </div>
            <div class="item">
              <div class="header">
                <div class="img">
                <img src="<?= RESOURCE_HOST ?>/img/veramine/feature02.svg" alt=""/>
                </div>
                <p class="ttl">Deception<br>テクノロジー</p>
              </div>
              <div class="main">
                <p class="desc">おとり環境へ標的型サイバー攻撃を誘導し攻撃者を・騙す"ソリューションで攻撃を 阻止します。</p>
                <p class="note">Veramine DynamicDeception System (VDDS)</p>
              </div>
            </div>
            <div class="item">
              <div class="header">
                <div class="img">
                <img src="<?= RESOURCE_HOST ?>/img/veramine/feature04.svg" alt=""/>
                </div>
                <p class="ttl">内部のセキュリティ違反<br>もすぐ検知</p>
              </div>
              <div class="main">
                <p class="desc">あらゆるアクテイヒティをモ二タリングし悪意のあるすべての操作を検知できます。 </p>
                <p class="note">Veramine引de′ TわヨtPレeれ0 (VITP)</p>
              </div>
            </div>
          </div>

          <div class="feature-txt">
            昨今は、ゼロディ攻撃、標的型攻撃といった巧妙な手口を用いたサイバー攻撃が増えており、従来のセキュリティ対策ソフト( EPP)では攻撃を防ぐことが難しくなっています。<br>Veramineは、 会社が保有する全てのPC・ノートパソコン・サーバーの挙動を包括的にモニタリングすることができます。個々のデバイスではなく複数デバイスのデータを関連付けて分析するため、インシデント発生時にも感染経路や感染範囲を素早く特定し、被害を最小限に抑えることができます
          </div>
        </div>
      </div><!-- /option -->

      <div class="feature">
        <div class="holder">
          <div class="wrap">
            <h3 class="product-ttl product-ttl--line">Features of Products and Services</h3>
            <div class="content">
              <div class="ttl">Data Collection and Monitoring</div>
              <div class="txt">Data Quality: Variety. Detailed. Structured. Real Time. Small Traffic. Security-related activities: Process, Registry, System Security, Network, User, SMB, Binaries, AMSI...</div>
              <div class="txt">Flexible collection policies: admins can select what data to collect. Adaptive filter: sensors smartly don't send irrelevant high-volume events to servers, that can filter out TB's of traffic sent and processed by sensors and servers.</div>
              <div class="txt">External and Insider Threats Prevention with Advanced Monitoring on Data, Devices and Users, such as Key loggers, Video and Screenshot captures, Activities of Browsing-Email-SMB, USB Management Logged Tracking and Access Control Policies (Blocked, Read-Only, or Read-Write), User sessions, User and Entity Behavior Analytics (UEBA)<br>-----</div>
            </div>
            <div class="content">
              <div class="ttl">Detection and Deception</div>
              <div class="txt">Detect attack tactics and techniques in https://attack.mitre.org/wiki/Technique_Matrix.</div>
              <div class="txt">More collected data types allow more data analysis algorithms, combining rule-based and machine learning, resulting in better Detection. Examples: SMB data allows detecting Lateral Movement and Insider Threats; Precise Elevation of Privilege (EOP) detection by collecting security tokens; Lsass process open allows detecting credentials and passwords dumping (Mimikatz); Command arguments allow detecting Malicious Powershell intrusions...</div>
              <div class="txt">Deception is an Active Defense approach, whereas most existing approaches are Passive Defense. Platform of Traps, put along the kill chain, to cheat, detect and prevent intrusions. Capable of making every computer (physical or \/M) a honeypot, in IT Systems. Uniquely offered by Veramine.</div>
              <div class="txt">Deceptive services, processes, files, mutexes, credentials, network listeners, data shares, registry helper, VMs... Track intruders' activities, and limit things they can do, with the traps. E.g. WannaCry checks a mutex to decide if a system is already infected, and we can set such a deceptive mutex.</div>
            </div>
            <div class="content">
              <div class="ttl">Incident Response and Forensics</div>
              <div class="txt">Yara Search on Memory and Files. Memory dumps are at fingertips. Collected data is searchable using flexible logical expressions. All executable binaries are col ected for forensics.</div>
              <div class="txt">Veramine have most Response Actions, from Binaries, Users, Hosts to Processes. E.g. Network Quarantine, Process Suspend/Terminate, User Disable/Disconnect, Host Sleep/Shutdown/Restart, Binary Block, Scan with Virus Total...</div>
              <div class="txt">Forensics with Velociraptor to collect various built-in or customized artifacts from multiple endpoints in real-time from centralized portal. VQL, similar to SQL, allows collection tasks to be quickly programmed, automated and shared, so that turn-around from IOC to fu I hunt can be a few minutes. E.g. VQL to search and collect fi es in users' temp directory which have been created within the last week.</div>
            </div>
            <div class="content">
              <div class="ttl">Performance, Deployment, Integration and Managemen</div>
              <div class="txt">Veramine sensors on average take less than 1% CPU and 20 MB RAM, network traffic is less than 30 MB/day/host, and can be further tuned using col ection policies. Easy deployment to the whole network such as using AD, SCCM or psexec.</div>
              <div class="txt">Integration with S EM, VDI, LDAP, AD, 2-fact Authen, APIs. Sensor Emergency & Autoupdate. Server: Multisite and audited.</div>
            </div>
            <div class="content">
              <div class="ttl">Training and Education</div>
              <div class="txt">Veramine Founders</div>
              <div class="txt">- authored a number of books, such as "Practical Reverse Engineering" best rated on Amazon.com</div>
              <div class="txt">- spoke and trained at most respected venues Black Hat, Recon, CCC, NATO...</div>
            </div>
          </div>
        </div>
      </div><!-- /feature -->
    </div>
    <!-- END: Veramine -->
  </div>

<?php endwhile;
endif; ?>
<?php get_footer(); ?>
