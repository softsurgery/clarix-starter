import { Component, OnInit, signal, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import LayoutComponent from "../components/layout/layout.component";
import { HlmToasterImports } from "@spartan-ng/helm/sonner";
import { AuthPersistRepository } from "@/stores/auth-persist/auth-persist.repository";
import { map } from "rxjs/operators";
@Component({
  selector: "app-root",
  imports: [RouterOutlet, LayoutComponent, HlmToasterImports],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App implements OnInit {
  private authRepository = inject(AuthPersistRepository);

  protected readonly title = signal("clarix");
  protected readonly isElectron = signal(false);
  protected readonly platform = signal("");
  protected readonly electronVersion = signal("");
  protected readonly nodeVersion = signal("");
  protected readonly chromeVersion = signal("");
  protected readonly pingResult = signal("");
  protected readonly isAuthenticated = signal(false);

  ngOnInit(): void {
    // Set up authentication state
    this.authRepository
      .getObservable<boolean>("authenticated")
      .pipe(map((auth) => auth || false))
      .subscribe((isAuth) => {
        this.isAuthenticated.set(isAuth);
      });

    if (window.electronAPI) {
      this.isElectron.set(true);
      this.platform.set(window.electronAPI.getPlatform());
      this.electronVersion.set(window.electronAPI.getElectronVersion());
      this.nodeVersion.set(window.electronAPI.getNodeVersion());
      this.chromeVersion.set(window.electronAPI.getChromeVersion());

      window.electronAPI.ping().then((result) => {
        this.pingResult.set(result);
      });
    }
  }
}
